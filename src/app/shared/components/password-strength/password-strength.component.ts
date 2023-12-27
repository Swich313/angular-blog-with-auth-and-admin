import {Component, Input, OnInit} from '@angular/core';
import {PasswordService} from "../../../user/profile/shared/services/password.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnInit{
  passwordStrength: number
  sectionColor = '#EDEDEDFF';
  textColor: string
  colorsAndMessages = [
    {color: '#880808', message: 'Poor', textColor: '#880808'},
    {color: '#ff4500', message: 'Not Good', textColor: '#ff4500'},
    {color: '#fafa33', message: 'Average', textColor: '#bdbd46'},
    {color: '#9dff00', message: 'Good', textColor: '#9dff00'}
  ]
  message: string = ''

  @Input()
  password: Observable<string>

  @Input()
  customWidth?: number

  constructor(private passwordService: PasswordService) {
  }

  ngOnInit(): void {
    this.onChanges(this.password)
  }

  onChanges(password: Observable<string>): void {
    password.subscribe(pass => {
      if(!pass) {
        this.message = ''
        this.sectionColor = '#EDEDEDFF'
        return
      }
      if(pass?.length === 0) {
        this.sectionColor = '#EDEDEDFF'
        this.message = ''
      }
      this.passwordStrength = this.passwordService.checkStrength(pass)

      this.sectionColor = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].color
      this.message = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].message
      this.textColor = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].textColor
    })
  }
}
