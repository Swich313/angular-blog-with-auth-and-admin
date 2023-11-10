import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert.service";
import {PostService} from "../../shared/services/post.service";
import {Post} from "../../shared/interfaces";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss']
})
export class CreatePostPageComponent implements OnInit{
  form: FormGroup
  imageSources = [
    {id: 1, name: 'Enter URL', value: 'url'},
    {id: 2, name: 'Choose Image File', value: 'file'}
  ]
  selectedImageSource: string
  isSubmitted = false

  protected _urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  protected _imageRegex = /.*\.(gif|jpg|jpeg|bmp|png)$/igm
  protected _tagsRegex = /(#+[a-zA-Z\d(_)]+)/igm
  protected _cloudName = environment.cloudinaryCloudName
  protected _preset = environment.cloudinaryUploadPreset

  @ViewChild('imageFile')
  imageFile

  constructor(
    private alertService: AlertService,
    private postService: PostService
  ) {
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      imageUrl: new FormControl(null, Validators.required),
      imageSource: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      tags: new FormControl(null, Validators.pattern(this._tagsRegex))
    })
    this.form.patchValue({imageSource: this.imageSources[0].value})
    this.selectedImageSource = this.form.get('imageSource').value
    this.form.controls['imageUrl'].addValidators(Validators.pattern(this.validatorPattern(this.selectedImageSource)))

  }

  onRadioButtonsChange(e) {
    this.selectedImageSource = this.form.get('imageSource').value
    this.form.controls['imageUrl'].setValidators([Validators.required, Validators.pattern(this.validatorPattern(this.selectedImageSource))])
    this.form.controls['imageUrl'].updateValueAndValidity()
    console.log('selectedImageSource after change', this.selectedImageSource, 'imageSource control validators after change', this.form.controls['imageUrl'].validator)
  }

  validatorPattern(selectedRadioButton: string): RegExp {
    return selectedRadioButton === this.imageSources[0].value ? this._urlRegex : this._imageRegex
  }

  submit() {
    if(this.form.invalid){
      return
    }
    this.isSubmitted = true

    let post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date(),
      tags: this.form.value.tags,
      imageUrl: ''
    }
    //already have ImageUrl
    if(this.selectedImageSource === this.imageSources[0].value){

      post = {
        ...post,
        imageUrl: this.form.value.imageUrl
      }
      this.postService.create(post).subscribe(() => {
        this.form.reset()
        this.isSubmitted = false
        this.form.patchValue({imageSource: this.selectedImageSource})
        this.alertService.success('Post was created successfully!')
      })
    } else {
      const formData = new FormData()
      formData.append('file', this.imageFile.nativeElement.files[0])
      formData.append('upload_preset', this._preset)
      formData.append('cloud_name', this._cloudName)
      formData.append('public_id', this.imageFile.nativeElement.files[0] + Date.now())
      this.postService.uploadImg(formData).subscribe(imageData => {
        post = {
          ...post,
          imageUrl: imageData.url
        }
        this.postService.create(post).subscribe(() => {
          this.isSubmitted = false
          this.form.reset()
          this.form.patchValue({imageSource: this.selectedImageSource})
          this.alertService.success('Post was created successfully!')
        })
      })
    }


  }

}
