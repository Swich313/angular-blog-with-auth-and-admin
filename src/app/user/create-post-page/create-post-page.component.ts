import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert.service";
import {PostService} from "../../shared/services/post.service";
import {Post, UserInfo} from "../../shared/interfaces";
import {environment} from "../../environments/environment";
import {UserService} from "../profile/shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import transformJavaScript from "@angular-devkit/build-angular/src/tools/esbuild/javascript-transformer-worker";

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
  currentImageUrl: string
  isSubmitted = false
  userId: string
  userInfoSub: Subscription

  // readonly _urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  readonly _urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  readonly _imageRegex = /.*\.(gif|jpg|jpeg|bmp|png)$/
  readonly _tagsRegex = /(#+[a-zA-Z\d(_, )]+)/

  @ViewChild('imageFile')
  imageFile

  constructor(
    private alertService: AlertService,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService
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

    this.userId = this.authService.userId
    this.userService.getUserInfoById(this.userId)
      .then(res => {
        const {name} = res.docs[0].data() as UserInfo
            this.form.patchValue({author: name})
      })
      .catch(err => {
        console.log(err)
      })
  }

  onRadioButtonsChange(e) {
    this.selectedImageSource = this.form.get('imageSource').value
    if(this.form.value.imageUrl && this.selectedImageSource === this.imageSources[1].value) this.currentImageUrl = this.form.value.imageUrl
    if(this.selectedImageSource === this.imageSources[1].value){
      console.log('currentImageUrl', this.currentImageUrl)
      this.form.patchValue({'imageUrl': ''})
    } else {
      console.log('currentImageUrl', this.currentImageUrl)
      this.form.patchValue({'imageUrl': this.currentImageUrl})
    }
    this.form.controls['imageUrl'].setValidators([Validators.required, Validators.pattern(this.validatorPattern(this.selectedImageSource))])
    this.form.controls['imageUrl'].updateValueAndValidity()
    console.log('selectedImageSource after change', this.selectedImageSource, 'imageSource control validators after change', this.form.controls['imageUrl'].validator)
  }

  validatorPattern(selectedRadioButton: string): RegExp {
    return selectedRadioButton === this.imageSources[0].value ? this._urlRegex : this._imageRegex
  }

  submit() {
    if(this.form.invalid){
      console.log("validation error", this.form.get('tags').value, this.form.get('tags').errors)
      return
    }

    this.isSubmitted = true

    let post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      tags: this.form.value.tags,
      imageUrl: '',
      userId: this.userId
    }
    //already have ImageUrl
    if(this.selectedImageSource === this.imageSources[0].value){
      post = {
        ...post,
        imageUrl: this.form.value.imageUrl
      }
      this.create(post)
    } else {
      const formData = this.postService.createFormData(this.imageFile.nativeElement.files[0])
      this.postService.uploadImg(formData).subscribe(imageData => {
        post = {
          ...post,
          imageUrl: imageData.url
        }
        this.create(post)
      })
    }
  }

  private create(post: Post){
    this.postService.createPost(post).then(_res => {
      console.log({_res})
      this.form.reset({
        author: this.form.get('author').value
      })
      this.isSubmitted = false
      this.form.patchValue({imageSource: this.selectedImageSource})
      this.alertService.success('Post was created successfully!')
    })
      .catch(err => {
        console.log(err)
        this.isSubmitted = false
        this.alertService.danger('Some shit happened! Try again!')
      })
  }

  onImageChange($event: Event){
    this.form.patchValue({'imageUrl': this.imageFile.nativeElement.files[0].name})
  }
}
