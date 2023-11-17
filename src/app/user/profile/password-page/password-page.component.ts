import {Component, ElementRef, OnInit} from '@angular/core';
import { faCopy, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {from} from "rxjs";
import {GeneratePasswordComponent} from "../shared/components/generate-password/generate-password.component";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss']
})
export class PasswordPageComponent implements OnInit{
  form: FormGroup
  passwordShowMode = false
  isSubmitted = false
  showIcon = faEye
  hideIcon = faEyeSlash
  clipboardIcon = faCopy

  name: string;
  color: string;

  private lazyLoadsGeneratePassword$ = from(
    import('../shared/components/generate-password/generate-password.component')
      .then(component => component.GeneratePasswordComponent)
  )

  togglePasswordShowMode() {
    this.passwordShowMode = !this.passwordShowMode
  }

  constructor(public dialog: MatDialog, private modalService: ModalService){
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
}
