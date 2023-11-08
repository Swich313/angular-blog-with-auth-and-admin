import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faGithub, faGoogle, faFacebook} from "@fortawesome/free-brands-svg-icons";
import {faChevronRight, faLock, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {User} from "../../shared/interfaces";
import {AlertService} from "../shared/services/alert.service";

const ALL_AUTH_MODES = ['login', 'signup'] as const
type AuthModeTuple = typeof ALL_AUTH_MODES
export type AuthMode = AuthModeTuple[number]
// export type AuthMode = 'login' | 'signup'

function isAuthMode(value: string): value is AuthMode {
  return ALL_AUTH_MODES.includes(value as AuthMode)
}

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit, OnDestroy{
  public form: FormGroup
  submitted = false
  message: string
  authMode: AuthMode

  authSub: Subscription

  emailIcon = faEnvelope
  lockIcon = faLock
  chevronIcon = faChevronRight
  googleIcon = faGoogle
  githubIcon = faGithub
  facebookIcon = faFacebook

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    if(this.authService.isAuth()) this.router.navigate(['/author', 'dashboard'])

    this.route.queryParams.subscribe((params: Params) => {
      if(params['auth']) {
        this.alertService.warning('Please login!')
      }else if(params['authFailed']){
        this.alertService.warning('Session is over, please login again!')
      }
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    //subscribe to params and check whether param :authType is of type AuthMode (tuple 'login' | 'signup')
    this.authSub = this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        if(isAuthMode(params.get('authType'))){
          this.authMode  = params.get('authType') as AuthMode
        } else if(params.get('authType').toLowerCase().includes('login')){
          //if param contains 'login' (case insensitive) redirect to /author/auth/login
          this.router.navigate(['/author', 'auth', 'login'])
        } else if(params.get('authType').toLowerCase().includes('signup')){
          //if param contains 'signup' (case insensitive) redirect to /author/auth/signup
          this.router.navigate(['/author', 'auth', 'signup'])
        } else {
          //if param contains everything else redirect to /author/auth/login
          this.router.navigate(['/author', 'auth', 'login'])
        }
      },
      error: (error) => {
        console.log({error})
        this.message = error.message
        console.log('message', this.message)
      }
    })

    this.authService.changeData(this.authMode)
    console.log(this.form)

  }

  submit() {
    console.log(this.form.value)
    if (this.form.invalid){
      return
    }
    this.submitted = true
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    //AuthMode login
    if(this.authMode === ALL_AUTH_MODES[0]){
        this.authService.login(user).subscribe(res => {
          this.form.reset()
          this.submitted = false
          this.router.navigate(['/author', 'dashboard'])
        }, () => {
          this.submitted = false
        })
    }
    //AuthMode signup
    if(this.authMode === ALL_AUTH_MODES[1]){
      this.authService.signup(user).subscribe(        {
          next: (res) => {
            console.log({res})
            this.form.reset()
            this.alertService.success('Your account was created successfully!')
            this.submitted = false
            this.router.navigate(['/author', 'auth', 'login'])
          },
          error: () => {
            this.submitted = false
          }
        })

    }
  }

  showAlert() {
    this.alertService.success('Your account was created successfully!')
  }


  cancel() {

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe()
  }

  loginNavigate() {
      this.router.navigate(['/author', 'auth', 'login'])
  }
}
