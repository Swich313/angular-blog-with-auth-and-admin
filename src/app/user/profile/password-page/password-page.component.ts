import {Component, ElementRef, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { faCopy, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {from} from "rxjs";
import {GeneratePasswordComponent} from "../shared/components/generate-password/generate-password.component";
import {ModalService} from "../../../shared/services/modal.service";
import {PasswordService} from "../shared/services/password.service";

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss']
})
export class PasswordPageComponent implements OnInit{
  form: FormGroup
  passwordShowMode = {oldPass: false, newPass: false}
  isSubmitted = false
  showIcon = faEye
  hideIcon = faEyeSlash
  clipboardIcon = faCopy

  name: string;
  color: string;

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


  private lazyLoadsGeneratePassword$ = from(
    import('../shared/components/generate-password/generate-password.component')
      .then(component => component.GeneratePasswordComponent)
  )

  togglePasswordShowMode(passwordType: 'oldPass' | 'newPass') {
    this.passwordShowMode[passwordType] = !this.passwordShowMode[passwordType]
  }

  constructor(
    public dialog: MatDialog,
    private modalService: ModalService,
    private passwordService: PasswordService){
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      newConfirmPassword: new FormControl(null, [
        Validators.required,
        // Validators.pattern(`/${this.form.get('newPassword').value}/`,

      ])
    })
    this.onChanges()
  }

  submit() {
    if(this.form.invalid ){
      return
    }
    this.isSubmitted = true
    const passwords = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
      newConfirmPassword: this.form.value.newConfirmPassword,
    }
    console.log({passwords})
  }

  openDialog(): void {

    const dialogRef = this.modalService.showDialog(this.lazyLoadsGeneratePassword$, 'Generate Password');

    dialogRef.afterClosed().subscribe(
      data => data.subscribe(
        item => console.log("Dialog output:", item)
      )
    );
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(value => {
      if(!value.newPassword) {
        this.message = ''
        this.sectionColor = '#EDEDEDFF'
        return
      }
      const password = value.newPassword
      if(password?.length === 0) {
        this.sectionColor = '#EDEDEDFF'
        this.message = ''
      }
      this.passwordStrength = this.passwordService.checkStrength(password)

      this.sectionColor = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].color
      this.message = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].message
      this.textColor = this.colorsAndMessages[`${Math.floor(this.passwordStrength/10) - 1}`].textColor
    })
  }
}
