import {inject, Injectable, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {AuthMode} from "../../auth-page/auth-page.component";
import {FirebaseAuthResponse, instanceOfFirebaseAuthResponse, UserInfo} from "../../../shared/interfaces";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {
  Auth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged, onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut, user, updateProfile
} from "@angular/fire/auth";
import {UserService} from "../../profile/shared/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private data = new Subject<AuthMode>()
  // private user: User
  data$ = this.data.asObservable()
  public error$: Subject<string> = new Subject()

  private userData: any
  private isUserLogIn: Subject<boolean> = new Subject<boolean>()
  private auth: Auth = inject(Auth)
  user$ = user(this.auth)

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private ngZone: NgZone,
    private userService: UserService
    ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    onIdTokenChanged(this.auth, (user: any) => {
        if(user) {
          this.userData = user
          localStorage.setItem('user', JSON.stringify(this.userData))
          // JSON.parse(localStorage.getItem('user')!)
        } else {
          localStorage.setItem('user', 'null')
          // JSON.parse(localStorage.getItem('user')!)
        }
    })
  }



  get isAuth(): boolean {
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string);
    return user !== null;
  }

  get userId(): string {
    return this.getCurrentUser().uid
  }

  //get Authenticated user from firebase
  getCurrentUser(){
    const token = localStorage.getItem('user')
    return JSON.parse(token as string);
    // return this.auth.currentUser;
  }

  updateUserInfo(displayName: string, photoUrl: string){
    return updateProfile(this.auth.currentUser, {
      displayName,
      photoURL: photoUrl
    })
  }

  refreshUser() {
    user(this.auth).subscribe(user => {
      console.log({user})
    })
  }

  // Sign up with email/password firebase API
  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(result => {
        this.userData = result.user
        //add empty document to userInfo collection into FireStore
        const userInfo: UserInfo = {
          name: '',
          avatarUrl: '',
          userId: this.userData.uid,
          birthday: '',
          gender: ''
        }
        this.userService.createUserInfo(userInfo)
        this.ngZone.run(() => {
          /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
          this.sendVerificationMail()
          this.alertService.success('Your account was created successfully!')
          this.router.navigate(['/author', 'profile'])
        })
      })
      .catch(error => {
          this.handleError(error)
      })
  }

  // login with email/password firebase API
  login(email: string, password: string) {
    // return this.afAuth
     return  signInWithEmailAndPassword(this.auth, email, password)
      .then(result => {
        this.userData = result.user

        this.ngZone.run(() => {
          this.router.navigate(['/author', 'dashboard'])
        })
      })
      .catch(error => {
        window.alert(error.message);
      })
  }

  // logout with email/password firebase API
  logout(){
    // return this.afAuth.

    return signOut(this.auth).then(() => this.router.navigate(['/author', 'auth', 'login'], {
      queryParams: {auth: false}
    }))
  }

  // Send email verification when new user sign up
  sendVerificationMail() {
    return sendEmailVerification(this.auth.currentUser)
      // .then((u: any) => u.sendEmailVerification())
      // .then(() => {
      //   this.router.navigate(['verify-email'])
      // })
  }

  //Send Password Reset Email
  sendPasswordResetEmails(email : string){
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.alertService.success('Password reset email sent, check your inbox.')
      })
      .catch(err => {
        this.alertService.warning(err)
      })
  }
  // sign up with email/password REST API
  // signup(user: User): Observable<any> {
  //   this.user = user
  //   const apiKey = environment.firebase.apiKey
  //   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, user)
  //     .pipe(
  //       mergeMap((res: FirebaseAuthResponse) => {
  //         const newUser: User = {
  //           ...this.user,
  //           userId: res.localId
  //         }
  //         return this.userService.create(newUser)
  //       }),
  //       catchError(this.handleError.bind(this))
  //     )
  // }



  //login with Google
  googleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider())
      .then((res) => {
        this.router.navigate(['/author', 'dashboard'])
      })
  }

  //login with Facebook
  facebookAuth() {
    return this.loginWithPopup(new FacebookAuthProvider())
      .then((res) => {
        this.router.navigate(['/author', 'dashboard'])
      })
  }

  //Pop up Provider
  loginWithPopup(provider: any){
    // return this.afAuth.
    return signInWithPopup(this.auth, provider)
      .then(() => {
        this.router.navigate(['/author', 'dashboard'])
      })
      .catch(err => {
        window.alert(err)
      })
  }


  // login with email/password REST API
  // login(user: User): Observable<any> {
  //   user.returnSecureToken = true
  //   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`, user)
  //     .pipe(
  //       tap(this.setToken),
  //       tap(this.setUserId),
  //       catchError(this.handleError.bind(this))
  //     )
  // }

  // loginViaGoogle(user: SocialUser): Observable<any> {
  //   return this.userService.getUserById(user.id).subscribe({
  //       next: (res) => {
  //           if(res.length === 0) {
  //             const newUser: User = {
  //               userId: user.id,
  //               email: user.email,
  //               loginType: "google",
  //               password: null
  //             }
  //             this.userService.create(newUser).pipe(
  //               tap(this.setToken),
  //               tap(this.setUserId),
  //               catchError(this.handleError.bind(this))
  //             )
  //             } else {
  //             console.log({res})
  //           }
  //       },
  //       error: () => {
  //       }
  //     })
  // }

//   this.userService.getUserById(user.id).pipe(
//     tap(res => console.log(res))
// ).subscribe(res => {
//   if(res.length === 0){
//   const newUser: User = {
//     userId: user.id,
//     email: user.email,
//     loginType: "google",
//     password: null
//   }
//   this.userService.create(newUser).subscribe(res => {
//   this.submitted = false
//   this.alertService.success('Successfully logged in with google!!')
//   this.router.navigate(['/author', 'dashboard'])
//
// })
// }
// })



  // logout with email/password REST API
  // logout() {
  //   this.setToken(null)
  //   this.setUserId(null)
  // }

  changeData(data: AuthMode) {
    this.data.next(data)
  }

  // isAuth with email/password REST API
  // isAuth(): boolean {
  //   return !!this.token
  // }

  // isAuth with email/password firebase API
  // isAuth(): boolean {
  //
  // }

  private handleError(error: any){
    const errorCode = error.code;
    if(errorCode === 'auth/email-already-in-use'){
      const customMsg = `An account with email address ${this.userData.email} already exists`
      this.error$.next(customMsg)
      this.alertService.warning(customMsg)
    }
  }

  // handleError with email/password REST API
  // private handleError(error: HttpErrorResponse){
  //   const {message} = error.error.error
  //   if (message === 'EMAIL_EXISTS'){
  //     const customMsg = `An account with email address ${this.user.email} already exists`
  //     this.error$.next(customMsg)
  //     this.alertService.warning(customMsg)
  //   } else if(message === 'INVALID_LOGIN_CREDENTIALS'){
  //     const customMsg = 'Invalid email or password'
  //     this.error$.next(customMsg)
  //     this.alertService.warning(customMsg)
  //   } else if (message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')){
  //     const customMsg = 'Too many attempts! Try again later.'
  //     this.error$.next(customMsg)
  //     this.alertService.warning(customMsg)
  //   }
  //   return throwError(() => error)
  // }

  private setToken(res: FirebaseAuthResponse | null) {
    if(instanceOfFirebaseAuthResponse(res)){
      const expireDate = new Date(new Date().getTime() + +res.expiresIn * 1000)
      localStorage.setItem('fb-token', res.idToken)
      localStorage.setItem('fb-token-exp', expireDate.toString())
    } else {
      localStorage.clear()
    }
  }

  // private setToken(res: FirebaseAuthResponse | null) {
  //   console.log('FirebaseAuthResponse typeof res', this.instanceOfFirebaseAuthResponse(res))
  //   console.log('SocialUser typeof res', res instanceof SocialUser)
  //   if(this.instanceOfFirebaseAuthResponse(res)) {
  //     const expireDate = new Date(new Date().getTime() + +res.expiresIn * 1000)
  //     localStorage.setItem('fb-token', res.idToken)
  //     localStorage.setItem('fb-token-exp', expireDate.toString())
  //   } else {
  //     localStorage.clear()
  //   }
  // }

  // setUserData(user: any) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`)
  //
  //   const userData: UserFB = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoUrl: user.photoUrl,
  //     emailVerified: user.emailVerified
  //   }
  //   return userRef.set(userData, {merge: true})
  //
  // }

  private setUserId(res: FirebaseAuthResponse | null) {
    if(res){
      localStorage.setItem('user-id', res.localId)
    } else {
      localStorage.clear()
    }
  }



}
