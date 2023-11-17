import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../shared/services/user.service";
import {FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {UserInfo} from "../../../shared/interfaces";
import {AuthService} from "../../shared/services/auth.service";
import {AlertService} from "../../shared/services/alert.service";
import {Subscription} from "rxjs";

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
  private userId: string
  public avatar = environment.defaultAvatarUrl
  checkIcon = faCheck
  isName = false
  isBirthday = false
  isSubmitted = false
  isNameInDB = false
  email: string = ''
  userInfoSub: Subscription
  userSub: Subscription

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
    this.userId = this.authService.userId
    this.isName = !!this.form.get('name').value
    this.isBirthday = !!this.form.get('birthday').value
    this.userInfoSub = this.userService.getUserInfoById(this.userId)
      .subscribe((user: UserInfo) => {
        console.log({user})
        this.form.patchValue({name: user[0].name})
        this.form.patchValue({gender: user[0].gender})
        this.avatar = user[0].avatarUrl
        if(user[0].birthday) this.form.patchValue({birthday: user[0].birthday})
        if(user[0].name) {
          this.isNameInDB = true
          this.userInfoId = user[0].userInfoId
          this.form.get('name').disable()
        }
        console.log('isNameInDB', this.isNameInDB)
      })
    this.userSub = this.userService.getUserById(this.userId)
      .subscribe({
        next: (res) => {
          this.email = res[0].email
        },
        error: err=> {}
      })


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
    const userInfo: UserInfo = {
      name: this.form.value.name,
      birthday: this.form.value.birthday,
      gender: this.form.value.gender,
      avatarUrl: this.avatar,
      userId: this.authService.userId
    }
    if(this.isNameInDB){
      this.userService.updateUserInfo(userInfo, this.userInfoId).subscribe({
        next: (res) => {
          this.isSubmitted = false
          this.alertService.success('Profile was updated!')
        },
        error: err => {
          this.isSubmitted = false
          this.alertService.danger('Profile was not updated!')
        }
      })
    } else {
      this.userService.addUserInfo(userInfo).subscribe({
        next: (res) => {
          this.isSubmitted = false
          this.alertService.success('Profile was updated!')
        },
        error: err => {
          this.isSubmitted = false
          this.alertService.danger('Profile was not updated!')
        }
      })
    }

    console.log({userInfo})

  }

  passData(type: 'name' | 'birthday'){
    console.log('data', this.form.get(type).value)
    console.log("form", this.form.value)
    if(type === 'name') {
      this.isName = !!this.form.get('name').value
      this.alertService.warning('Be careful, you won\'t be able to change your name')
    }
    if (type === 'birthday') {
      this.isBirthday = !!this.form.get('birthday').value
    }
  }

  editMode(type: 'name' | 'birthday'){
    if(type === 'name') {
      this.isName = false
    }
    if (type === 'birthday') {
      this.isBirthday = false
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
