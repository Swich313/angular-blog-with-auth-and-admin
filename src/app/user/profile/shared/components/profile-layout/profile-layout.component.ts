import { Component } from '@angular/core';
import {
  faCheck,
  faComputer,
  faEye,
  faEyeSlash,
  faGear,
  faKey,
  faList,
  faUser,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent {
  userIcon = faUser
  privacyIcon = faUserShield
  mediasIcon = faComputer
  settingIcon = faGear
  passwordIcon = faKey
  otherOptionsIcon = faList
}
