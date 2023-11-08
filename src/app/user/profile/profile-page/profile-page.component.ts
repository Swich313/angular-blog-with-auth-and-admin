import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../shared/services/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserInfo} from "../../../shared/interfaces";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  form: FormGroup
  myWidget
  protected _cloudName = environment.cloudinaryCloudName
  protected _cloudinaryPreset = environment.cloudinaryUploadPreset
  protected nameRegex =  /^[a-zA-Z]+$/
  public avatar = environment.defaultAvatarUrl
  checkIcon = faCheck
  isName = false
  isBirthday = false
  isSubmitted = false

  constructor(private profileService: UserService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.nameRegex)
      ]),
      birthday: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required])
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
    this.isName = !!this.form.get('name').value
    this.isBirthday = !!this.form.get('birthday').value


  }

  submit() {
    console.log(this.form.value)
    console.log('Errors name', this.form.get('name').errors)
    console.log('Errors birthday', this.form.get('birthday').errors)
    console.log('Errors gender', this.form.get('gender').errors)

    if(this.form.invalid ){
      return
    }
    this.isSubmitted = true
    const userInfo: UserInfo = {
      name: this.form.value.name,
      birthday: this.form.value.birthday,
      gender: this.form.value.gender,
      avatarUrl: this.avatar
    }
    console.log({userInfo})

  }

  passData(type: 'name' | 'birthday'){
    console.log('data', this.form.get(type).value)
    console.log("form", this.form.value)
    if(type === 'name') {
      this.isName = !!this.form.get('name').value
    }
    if (type === 'birthday') {
      this.isBirthday = !!this.form.get('birthday').value
    }
  }

  editMode(type: 'name' | 'birthday'){
    if(type === 'name') {
      console.log('fired')
      this.isName = false
    }
    if (type === 'birthday') {
      this.isBirthday = false
    }
  }

  openWidget() {
    this.myWidget.open();
  }
}
