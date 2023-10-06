import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{
  public form: FormGroup

  constructor(private authService: AuthService, private router:Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    console.log(this.form)
  }

  submit() {
    console.log(this.form.value)

    if(this.form.invalid ){
      return
    }
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authService.login(user).subscribe((res) => {
      console.log({res})
      this.form.reset()
      this.router.navigate(['/admin', 'dashboard'])
    })
  }

  cancel() {
    this.form.get('email').setValue('')
    this.form.get('password').setValue('')
  }
}
