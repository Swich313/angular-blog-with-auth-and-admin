import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {filter, map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {FirebaseCreateResponse, Post} from "../interfaces";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore, getDocs, serverTimestamp,
  setDoc,
  updateDoc, where, query, Timestamp, orderBy, limit, startAt, endAt, getCountFromServer
} from "@angular/fire/firestore";
import { AngularFireDatabase} from '@angular/fire/compat/database';
import {Auth, authState} from "@angular/fire/auth";
import {CollectionReference, DocumentData} from "@angular/fire/compat/firestore";

type OrderByField = "title" | "createdAt" | "author"
type AscOrDesc = "asc" | "desc"


@Injectable({
  providedIn: 'root'
})
export class PostService {
  readonly _firebaseDBUrl = environment.firebase.databaseURL
  readonly _cloudinaryUrl = environment.cloudinaryUrl
  readonly _cloudName = environment.cloudinaryCloudName
  readonly _preset = environment.cloudinaryUploadPreset

  post$: Observable<Post[]>
  private readonly postsCollection: any
  private firestore: Firestore = inject(Firestore)
  private auth: Auth = inject(Auth)
  private user$ = authState(this.auth).pipe(
    filter(user  =>  user !== null),
    map(user  =>  user!)
  );

  constructor(
    private http: HttpClient,
    ) {
    this.postsCollection = collection(this.firestore, 'posts')
    // const postCollection = collection(this.firestore, 'posts')
    this.post$ = collectionData(this.postsCollection) as Observable<Post[]>
  }

  createPost(post: Post){
    // const postCollection = collection(this.firestore, 'posts')
    const docRef = doc(this.postsCollection)

    return setDoc(docRef, {
        ...post,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    })
  }

  getAllPostsWithQuery(orderByField: OrderByField = 'createdAt', ascOrDesc: AscOrDesc, limitPosts: number, start: number  ){
    const q = query(this.postsCollection, orderBy(orderByField, ascOrDesc), limit(limitPosts), startAt(start))
    return getDocs(q)
  }

  getAllPosts() {
    return this.post$.pipe(
      map(posts => {
        return posts.map(item => {
          return {
            ...item,
            createdAt: this.convertFirestoreTimestampToDate(item.createdAt as Timestamp)}
        })
      })
    )
  }

  getAllPostsByAuthorId(userId: string) {
    // const postsCollection = collection(this.firestore, 'posts')
    const q = query(this.postsCollection, where("userId", "==", userId))
    return getDocs(q)
  }

  getPostById(id: string){
    return  docData(doc(this.firestore, 'posts', id), {idField:  'id'}) as  Observable<Post>
  }

  async getAmount(): Promise<number> {
    const snapshot = await  getCountFromServer(this.postsCollection)
    console.log({snapshot}, 'amount', snapshot.data().count)
    return snapshot.data().count
  }



  removePost(id: string) {
    return deleteDoc(doc(this.firestore, 'posts', id))
  }

  updatePost(post: Post) {
    const id = post.id
    if(!!id){
      return updateDoc(doc(this.firestore, 'posts', id), {
        ...post,
        updatedAt: serverTimestamp()
      })
    } else {
      return null
    }
  }




  uploadImg(formData: FormData): Observable<any> {
    return this.http.post(`${this._cloudinaryUrl}/${this._cloudName}/upload`, formData)
  }

  convertFirestoreTimestampToDate(timestamp: Timestamp){
    return new Date(timestamp['seconds'] * 1000)
  }

  createFormData(imageFile: File){
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', this._preset)
    formData.append('cloud_name', this._cloudName)
    formData.append('public_id', imageFile.toString() + Date.now())
    return formData
  }
}
