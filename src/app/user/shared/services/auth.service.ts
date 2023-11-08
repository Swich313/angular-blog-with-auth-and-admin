import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {catchError, mergeMap, Observable, Subject, tap, throwError} from "rxjs";
import {AuthMode} from "../../auth-page/auth-page.component";
import {FirebaseAuthResponse, User} from "../../../shared/interfaces";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {UserService} from "../../profile/shared/services/user.service";

@Injectable()
export class AuthService {
  private data = new Subject<AuthMode>()
  private user: User
  private _userId: string

  data$ = this.data.asObservable()
  public error$: Subject<string> = new Subject()

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private userService: UserService
    ) { }

  get token(): string {
    const expireDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expireDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  get userId(): string {
    return localStorage.getItem('user-id')
  }

  // signup(user: User): Observable<any> {
  //   this.user = user
  //   const apiKey = environment.apiKey
  //   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, user)
  //     .pipe(
  //       catchError(this.handleError.bind(this))
  //     )
  // }

  signup(user: User): Observable<any> {
    this.user = user
    const apiKey = environment.apiKey
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, user)
      .pipe(
        mergeMap((res: FirebaseAuthResponse) => {
          const newUser: User = {
            ...this.user,
            userId: res.localId
          }
          return this.userService.create(newUser)
        }),
        catchError(this.handleError.bind(this))
      )
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        tap(this.setUserId),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null)
    this.setUserId(null)
  }

  changeData(data: AuthMode) {
    this.data.next(data)
  }

  isAuth(): boolean {
    return !!this.token

  }

  private handleError(error: HttpErrorResponse){
    const {message} = error.error.error
    if (message === 'EMAIL_EXISTS'){
      const customMsg = `An account with email address ${this.user.email} already exists`
      this.error$.next(customMsg)
      this.alertService.warning(customMsg)
    } else if(message === 'INVALID_LOGIN_CREDENTIALS'){
      const customMsg = 'Invalid email or password'
      this.error$.next(customMsg)
      this.alertService.warning(customMsg)
    } else if (message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')){
      const customMsg = 'Too many attempts! Try again later.'
      this.error$.next(customMsg)
      this.alertService.warning(customMsg)
    }
    return throwError(() => error)
  }

  private setToken(res: FirebaseAuthResponse | null) {
    if(res){
      const expireDate = new Date(new Date().getTime() + +res.expiresIn * 1000)
      localStorage.setItem('fb-token', res.idToken)
      localStorage.setItem('fb-token-exp', expireDate.toString())
    } else {
      localStorage.clear()
    }
  }

  private setUserId(res: FirebaseAuthResponse | null) {
    if(res){
      localStorage.setItem('user-id', res.localId)
    } else {
      localStorage.clear()
    }
  }
}
