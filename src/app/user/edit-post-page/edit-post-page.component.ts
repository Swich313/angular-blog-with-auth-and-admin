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
  readonly _imageRegex = /.*\.(gif|jpg|jpeg|bmp|png)$/
  _tagsRegex = new RegExp("#[a-z0-9_]+")

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
          return this.postService.getPostById(params['id'])
        })
      ).subscribe((post: Post) => {
        this.editedPost = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
        imageUrl: new FormControl(post.imageUrl, Validators.required),
        tags: new FormControl(post.tags, Validators.pattern(this._tagsRegex)),
        imageSource: new FormControl(null, Validators.required),
      })
        //set imageSource to 'url'
      this.form.patchValue({imageSource: this.imageSources[0].value})
      this.selectedImageSource = this.form.get('imageSource').value
      this.form.controls['imageUrl'].addValidators(Validators.pattern(this.validatorPattern(this.selectedImageSource)))
    })

  }

  ngOnDestroy(): void {
    if(this.updateSub) this.updateSub.unsubscribe()
    if(this.loadingSub) this.loadingSub.unsubscribe()
  }

  validatorPattern(selectedRadioButton: string): RegExp {
    return selectedRadioButton === this.imageSources[0].value ? this._urlRegex : this._imageRegex
  }

  onRadioButtonsChange(e) {
    this.selectedImageSource = this.form.get('imageSource').value
    if(this.selectedImageSource === this.imageSources[1].value){
      this.form.patchValue({'imageUrl': ''})
    } else {
      this.form.patchValue({'imageUrl': this.editedPost.imageUrl})
    }

    this.form.controls['imageUrl'].setValidators([Validators.required, Validators.pattern(this.validatorPattern(this.selectedImageSource))])
    this.form.controls['imageUrl'].updateValueAndValidity()
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
    //already have ImageUrl

    if (this.selectedImageSource === this.imageSources[0].value) {
      this.update(post)
    } else {
      const formData = this.postService.createFormData(this.imageFile.nativeElement.files[0])
      this.updateSub = this.postService.uploadImg(formData).subscribe(imageData => {
        post = {
          ...post,
          imageUrl: imageData.url
        }
        this.update(post)
      })
    }
  }

  private update(post: Post) {
    this.postService.updatePost(post).then(_res => {
      this.isSubmitted = false
      this.alertService.success('Post was updated!')
    })
      .catch(err => {
        console.log({err})
        this.isSubmitted = false
        this.alertService.success('Some shit happened! Try again')
      })
  }

  onImageChange($event: Event){
    this.form.patchValue({'imageUrl': this.imageFile.nativeElement.files[0].name})
  }
}
