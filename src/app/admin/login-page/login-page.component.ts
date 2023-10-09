import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{
  public form: FormGroup
  submitted = false
  message: string

  constructor(
    public authService: AuthService,
    private router:Router,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if(params['auth']){
        this.message = 'Please login!'
      }
    })

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
    this.submitted = true
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authService.login(user).subscribe((res) => {
      console.log({res})
      this.form.reset()
      this.submitted = false
      this.router.navigate(['/admin', 'dashboard'])
    }, () => {
      this.submitted = false
    })
  }

  cancel() {
    this.form.get('email').setValue('')
    this.form.get('password').setValue('')
  }
}
