import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {AuthMode} from "../../auth-page/auth-page.component";
import {FirebaseAuthResponse, User} from "../../../shared/interfaces";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "./alert.service";

@Injectable()
export class AuthService {
  private data = new Subject<AuthMode>()
  private user: User

  data$ = this.data.asObservable()
  public error$: Subject<string> = new Subject()

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  get token(): string {
    const expireDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expireDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  signup(user: User): Observable<any> {
    this.user = user
    console.log('AuthService signup user:', user)
    console.log('apiKey', environment.apiKey)
    const apiKey = environment.apiKey
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, user)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout(): void {
    this.setToken(null)
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
}
