import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {count, map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {FirebaseCreateResponse, Post} from "../interfaces";
import {AuthService} from "../../user/shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  protected _firebaseDBUrl = environment.fbDbUrl
  protected _cloudinaryUrl = environment.cloudinaryUrl
  protected _cloudName = environment.cloudinaryCloudName

  constructor(
    private http: HttpClient,
    ) { }

  create(post: Post, userId: string): Observable<Post> {
    console.log('PostService', userId)
    const postWithUserId = {
      ...post,
      userId
    }
    return this.http.post(`${this._firebaseDBUrl}/posts.json`, postWithUserId)
      .pipe(
        map((res: FirebaseCreateResponse) => {
          return {
            ...post,
            id: res.name,
            date: new Date(post.date)
          }
        })
      )
  }

  getAll(perPage: number): Observable<Post[]> {
    return this.http.get(`${this._firebaseDBUrl}/posts.json?orderBy="date"&limitToFirst=${perPage}`)
      .pipe(
        map((res: {[key: string]: any}) => {
          return Object.
            keys(res)
            .map(key => {
              return {
                ...res[key],
                id: key,
                date: new Date(res[key].date)
            }})
        })
      )
  }

  getAmount(): Observable<number> {
    return this.http.get(`${this._firebaseDBUrl}/posts.json`)
        .pipe(
          map((res: {[key: string]: any}) => {
            return Object.keys(res).reduce((acc, _cur) => acc + 1, 0)
          })
        )
  }

  getAllByAuthorID(userId: string): Observable<Post[]> {
    return this.http.get(`${this._firebaseDBUrl}/posts.json?orderBy="userId"&startAt="${userId}"&endAt="${userId}\uf8ff"`)
      .pipe(
        map((res: {[key: string]: any}) => {
          return Object
            .keys(res)
            .map(key => {
              return {
                ...res[key],
                id: key,
                date: new Date(res[key].date)
              }})
        })
      )
  }



  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this._firebaseDBUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date)
          }
        })
      )
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this._firebaseDBUrl}/posts/${id}.json`)
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${this._firebaseDBUrl}/posts/${post.id}.json`, post)
  }

  uploadImg(formData: FormData): Observable<any> {
    return this.http.post(`${this._cloudinaryUrl}/${this._cloudName}/upload`, formData)
  }
}
