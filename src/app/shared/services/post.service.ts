import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {FirebaseCreateResponse, Post} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  protected _firebaseDBUrl = environment.fbDbUrl
  protected _cloudinaryUrl = environment.cloudinaryUrl
  protected _cloudName = environment.cloudinaryCloudName

  constructor(private http: HttpClient) { }

  create(post: Post): Observable<Post> {
    return this.http.post(`${this._firebaseDBUrl}/posts.json`, post)
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

  getAll(): Observable<Post[]> {
    return this.http.get(`${this._firebaseDBUrl}/posts.json`)
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

  // remove(): {
  //
  // }

  update(post: Post) {

  }

  uploadImg(formData: FormData): Observable<any> {
    return this.http.post(`${this._cloudinaryUrl}/${this._cloudName}/upload`, formData)
  }
}
