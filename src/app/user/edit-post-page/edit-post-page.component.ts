import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {AlertService} from "../shared/services/alert.service";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../../shared/interfaces";
import {PostService} from "../../shared/services/post.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-edit-post-page',
  templateUrl: './edit-post-page.component.html',
  styleUrls: ['./edit-post-page.component.scss']
})
export class EditPostPageComponent implements OnInit, OnDestroy{
  form: FormGroup
  editedPost: Post
  isSubmitted = false
  loadingSub: Subscription
  updateSub: Subscription
  imageSources = [
    {id: 1, name: 'Enter URL', value: 'url'},
    {id: 2, name: 'Choose Image File', value: 'file'}
  ]
  selectedImageSource: string
  protected _urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  protected _imageRegex = /.*\.(gif|jpg|jpeg|bmp|png)$/igm
  protected _tagsRegex = /(#+[a-zA-Z\d(_)]+)/igm
  protected _cloudName = environment.cloudinaryCloudName
  protected _preset = environment.cloudinaryUploadPreset

  @ViewChild('imageFile')
  imageFile

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loadingSub = this.route.params
      .pipe(
        switchMap((params: Params) => {
          console.log('param', params['id'])
          return this.postService.getById(params['id'])
        })
      ).subscribe((post: Post) => {
        this.editedPost = post
      console.log('editedPost', post)
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
        imageUrl: new FormControl(post.imageUrl, Validators.required),
        tags: new FormControl(post.tags, Validators.pattern(this._tagsRegex)),
        imageSource: new FormControl(null, Validators.required),
      })
      this.form.patchValue({imageSource: this.imageSources[0].value})
      this.selectedImageSource = this.form.get('imageSource').value
      this.form.controls['imageUrl'].addValidators(Validators.pattern(this.validatorPattern(this.selectedImageSource)))
    })

  }

  ngOnDestroy(): void {
    this.updateSub.unsubscribe()
    this.loadingSub.unsubscribe()
  }

  validatorPattern(selectedRadioButton: string): RegExp {
    console.log('selectedRadioButton', selectedRadioButton)
    console.log('validatorPattern', selectedRadioButton === this.imageSources[0].value ? this._urlRegex : this._imageRegex)
    return selectedRadioButton === this.imageSources[0].value ? this._urlRegex : this._imageRegex
  }

  onRadioButtonsChange() {
    this.form.controls['imageUrl'].setValue('')
    this.selectedImageSource = this.form.get('imageSource').value
    this.form.controls['imageUrl'].setValidators([Validators.required, Validators.pattern(this.validatorPattern(this.selectedImageSource))])
    this.form.controls['imageUrl'].updateValueAndValidity()
    console.log('selectedImageSource after change', this.selectedImageSource, 'imageSource control validators after change', this.form.controls['imageUrl'].validator)
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.isSubmitted = true
    let post = {
      ...this.editedPost,
      title: this.form.value.title,
      text: this.form.value.text,
      imageUrl: this.form.value.imageUrl,
      tags: this.form.value.tags
    }
    if (this.selectedImageSource === this.imageSources[0].value) {
      this.updateSub = this.postService.update(post)
        .subscribe(() => {
          this.isSubmitted = false
          this.alertService.success('Post was updated!')
        })
    } else {
      const formData = new FormData()
      formData.append('file', this.imageFile.nativeElement.files[0])
      formData.append('upload_preset', this._preset)
      formData.append('cloud_name', this._cloudName)
      formData.append('public_id', this.imageFile.nativeElement.files[0] + Date.now())
      this.updateSub = this.postService.uploadImg(formData).subscribe(imageData => {
        post = {
          ...post,
          imageUrl: imageData.url
        }
        this.postService.update(post).subscribe(() => {
          this.isSubmitted = false
          this.form.patchValue({imageSource: this.selectedImageSource})
          this.alertService.success('Post was updated!')
        })
      })
    }
  }

}
