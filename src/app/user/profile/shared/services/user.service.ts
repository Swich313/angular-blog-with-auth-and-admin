import { Injectable } from '@angular/core';
import {FirebaseAuthResponse, FirebaseCreateResponse, Post, User, UserInfo} from "../../../../shared/interfaces";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected _firebaseDBUrl = environment.fbDbUrl

  constructor(
    private http: HttpClient,
  ) { }

  create(user: User): Observable<User> {
    return this.http.post(`${this._firebaseDBUrl}/users.json`, user)
      .pipe(
        map((res: FirebaseAuthResponse) => {
          return {
            ...user,
            userId: res.localId
          }
        })
      )
  }

  addUserInfo(userInfo: UserInfo): Observable<any> {
    return this.http.post(`${this._firebaseDBUrl}/userInfo.json`, userInfo)
  }

  getUserById(userId: string): Observable<any> {
    console.log(userId)
    return this.http.get<UserInfo>(`${this._firebaseDBUrl}/userInfo.json?orderBy="userId"&startAt="${userId}"&endAt="${userId}\uf8ff"`)
      .pipe(
        map((res: {[key: string]: any}) => {
          return Object
            .keys(res)
            .map(key => {
              return {
                ...res[key],
                userId: key
              }
            })
        })
      )
  }
}


