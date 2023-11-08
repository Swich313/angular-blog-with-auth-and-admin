import { Injectable } from '@angular/core';
import {FirebaseAuthResponse, FirebaseCreateResponse, Post, User} from "../../../../shared/interfaces";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected _firebaseDBUrl = environment.fbDbUrl

  constructor(private http: HttpClient) { }

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

  }}


// create(post: Post): Observable<Post> {
//   return this.http.post(`${this._firebaseDBUrl}/posts.json`, post)
//     .pipe(
//       map((res: FirebaseCreateResponse) => {
//         return {
//           ...post,
//           id: res.name,
//           date: new Date(post.date)
//         }
//       })
//     )
// }
