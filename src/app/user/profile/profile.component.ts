import { Component } from '@angular/core';
import {faGear, faUser, faKey, faList, faComputer, faEye, faEyeSlash, faCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userIcon = faUser
  settingIcon = faGear
  mediasIcon = faComputer
  passwordIcon = faKey
  otherOptionsIcon = faList
  openedEyeIcon = faEye
  closedEyeIcon = faEyeSlash
  checkIcon = faCheck
}
