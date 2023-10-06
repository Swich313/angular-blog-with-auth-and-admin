import { Injectable } from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

import {FBAuthResponse, User} from "../../../shared/interfaces";
import {environment} from "../../../environments/environment"


@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return ''
  }

  login(user: User): Observable<any>{
    console.log('apiKey', environment.apiKey)
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
    )
  }

  logout() {

  }

  isAuth(): boolean{
    return !!this.token
  }

  private setToken(res: FBAuthResponse) {
    console.log('setToken response', res)
  }
}
