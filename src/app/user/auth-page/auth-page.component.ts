import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faGithub, faGoogle, faFacebook} from "@fortawesome/free-brands-svg-icons";
import {faChevronRight, faLock, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";
import {Subscription, tap} from "rxjs";
import {User} from "../../shared/interfaces";
import {AlertService} from "../shared/services/alert.service";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {UserService} from "../profile/shared/services/user.service";
import transformJavaScript from "@angular-devkit/build-angular/src/tools/esbuild/javascript-transformer-worker";
import {error} from "@angular/compiler-cli/src/transformers/util";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;

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
  // for Google login
  user: SocialUser;
  loggedIn: boolean;

  emailIcon = faEnvelope
  lockIcon = faLock
  chevronIcon = faChevronRight
  googleIcon = faGoogle
  githubIcon = faGithub
  facebookIcon = faFacebook

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit(): void {
    if(this.authService.isAuth) this.router.navigate(['/author', 'dashboard'])

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

    //Subscribe to the Google authentication state
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.submitted = true
    //   this.userService.getUserById(user.id).pipe(
    //     tap(res => console.log(res))
    //   ).subscribe(res => {
    //     if(res.length === 0){
    //       const newUser: User = {
    //         userId: user.id,
    //         email: user.email,
    //         loginType: "google",
    //         password: null
    //       }
    //       this.userService.create(newUser).subscribe(res => {
    //         this.submitted = false
    //         this.alertService.success('Successfully logged in with google!!')
    //         this.router.navigate(['/author', 'dashboard'])
    //
    //       })
    //     }
    //   })
    //   this.user = user
    //   this.loggedIn = (user != null)
    //   console.log(user)
    // })
  }

  submit() {
    console.log(this.form.value)
    if (this.form.invalid){
      return
    }
    this.submitted = true
    // const user: User = {
    //   email: this.form.value.email,
    //   password: this.form.value.password,
    //   loginType: 'email&password'
    // }
    const email = this.form.value.email
    const password = this.form.value.password
    // console.log({user})
    //AuthMode login
    if(this.authMode === ALL_AUTH_MODES[0]){
    this.authService.login(email, password)
      .then(_res => {
        this.submitted = false
      })
      .catch(_err => {
        this.submitted = false
      })
      //login with email/password with firebase API
      // this.authService.login(user)
      //   .then((res: UserCredential) => {
      //       this.form.reset()
      //       this.submitted = false
      //       this.router.navigate(['/author', 'dashboard'])
      //   })
      //   .catch(error => {
      //     this.submitted = false
      //   })

      //login with email/password with REST API
      // this.authService.login(user).subscribe({
      //     next: (res) => {
      //       this.form.reset()
      //       this.submitted = false
      //       this.router.navigate(['/author', 'dashboard'])
      //     },
      //     error: () => {
      //       this.submitted = false
      //     }
      //   })
    }
    //AuthMode signup
    if(this.authMode === ALL_AUTH_MODES[1]){
      this.authService.signup(email, password)
        .then(_res => {
          this.submitted = false
        })
        .catch(_err => {
          this.submitted = false
        })
      //signup with email/password firebase API
      // this.authService.signup(user)
      //   .then((res: UserCredential) => {
      //     console.log("res", res.user)
      //     this.alertService.success('Your account was created successfully!')
      //     this.submitted = false
      //     this.router.navigate(['/author', 'auth', 'login'])
      // })
      //   .catch(error => {
      //     this.submitted = false
      //   })

      //signup with email/password with REST API
      // this.authService.signup(user).subscribe({
      //     next: (res) => {
      //       console.log({res})
      //       this.form.reset()
      //       this.alertService.success('Your account was created successfully!')
      //       this.submitted = false
      //       this.router.navigate(['/author', 'auth', 'login'])
      //     },
      //     error: () => {
      //       this.submitted = false
      //     }
      //   })

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

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(res => {console.log(res)})
  }
}
