import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../shared/services/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { UserInfo} from "../../../shared/interfaces";
import {AuthService} from "../../shared/services/auth.service";
import {AlertService} from "../../shared/services/alert.service";
import {Observable, of, Subscription} from "rxjs";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;
import User = firebase.UserInfo;

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  form: FormGroup
  myWidget
  protected _cloudName = environment.cloudinaryCloudName
  protected _cloudinaryPreset = environment.cloudinaryUploadPreset
  protected nameRegex =  new RegExp("^[a-zA-Z -]*$")
  private  userInfoId: string
  currentUser: any
  public avatar = environment.defaultAvatarUrl
  checkIcon = faCheck
  // flags whether name and birthday specified in firestore userInfo collection for current user
  isUserInfoInDB = {
    name: false,
    birthday: false
  }
  //flags whether user clicked on button "add"
  isValueAddedInForm = {
    name: false,
    birthday: false
  }
  //info from current user object
  userEmailState = {
    email: '',
    emailVerified: false
  }
  isSubmitted = false
  isEmailSubmitted = false
  userInfoSub: Subscription
  userSub: Subscription
  userInfo: UserInfo

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.nameRegex)
      ]),
      birthday: new FormControl(null, [this.dateValidator]),
      gender: new FormControl(null)
    })

    this.authService.user$.subscribe({
      next: user => {
        this.userEmailState = {
          email: user.email,
          emailVerified: user.emailVerified
        }

        this.userService.getUserInfoById(user.uid)
          .then(res => {
            if(!(res.docs[0].data() as UserInfo).id){
              user.reload()
            }
          this.userInfo = res.docs[0].data() as UserInfo
            const {name, gender, birthday, avatarUrl} = this.userInfo
            if(name){
              this.form.patchValue({name})
              this.isUserInfoInDB.name = true
              this.form.get('name').disable()
            }
            if(avatarUrl) {
              this.avatar = avatarUrl
            }
            if(birthday){
              this.form.patchValue({birthday})
              this.isUserInfoInDB.birthday = true
            }
            if(gender){
              this.form.patchValue({gender})
              this.form.get('gender').disable()
            }
        })
      }
    })
    this.isValueAddedInForm.name = !!this.form.get('name').value
    this.isValueAddedInForm.birthday = !!this.form.get('birthday').value

    //@ts-ignore
    this.myWidget = cloudinary.createUploadWidget({
        cloudName: this._cloudName,
        uploadPreset: this._cloudinaryPreset
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.avatar = result.info.secure_url
        }
      })
  }

  submit() {
    if(this.form.invalid ){
      return
    }
    this.isSubmitted = true
    const avatarUrl = this.avatar
    const userInfo: UserInfo = {
      ...this.userInfo,
      name: this.form.value.name ?? this.userInfo.name,
      avatarUrl: avatarUrl,
      birthday: this.form.value.birthday ?? this.userInfo.birthday,
      gender: this.form.value.gender ?? this.userInfo.gender,
    }
    console.log({userInfo})
    this.userService.updateUserInfo(userInfo)
      .then(_res => {
        this.isSubmitted = false
        this.alertService.success('Your profile was updated successfully!')
      })
    }

  passData(type: 'name' | 'birthday'){
    console.log('data', this.form.get(type).value)
    console.log("form", this.form.value)
    if(type === 'name') {
      this.isValueAddedInForm.name = !!this.form.get('name').value
      this.alertService.warning('Be careful, you won\'t be able to change your name')
    }
    if (type === 'birthday') {
      this.isValueAddedInForm.birthday = !!this.form.get('birthday').value
    }
  }

  confirmEmail() {
    if(this.isEmailSubmitted){
      return
    }
    this.authService.sendVerificationMail()
      .then(_r => {
        this.isEmailSubmitted = true
        this.alertService.success("Email with verification link sent successfully!")
      })
  }

  editMode(type: 'name' | 'birthday'){
    if(type === 'name') {
      this.isValueAddedInForm.name = false
    }
    if (type === 'birthday') {
      this.isValueAddedInForm.birthday = false
    }
  }

  openWidget() {
    this.myWidget.open();
  }

  dateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const date = new Date(control.value);
      const today = new Date();
      if (date > today) {
        return { 'invalidDate': true }
      }
    }
    return null;
  }

  ngOnDestroy(): void {
  }
}
