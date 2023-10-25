import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faGithub, faGoogle, faFacebook} from "@fortawesome/free-brands-svg-icons";
import {faChevronRight, faLock, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthMode, AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit{
  public form: FormGroup
  submitted = false
  message: string
  authMode: AuthMode

  emailIcon = faEnvelope
  lockIcon = faLock
  chevronIcon = faChevronRight
  googleIcon = faGoogle
  githubIcon = faGithub
  facebookIcon = faFacebook

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    console.log('authMode:', this.authMode)
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    console.log(this.form)
  }

  submit() {
    console.log(this.form.value)
  }

  cancel() {

  }
}
