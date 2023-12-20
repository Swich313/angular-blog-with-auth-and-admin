import {inject, Injectable} from '@angular/core';
import {FirebaseAuthResponse, FirebaseCreateResponse, Post, User, UserInfo} from "../../../../shared/interfaces";
import {from, map, Observable} from "rxjs";
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database'
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  docData,
  collectionGroup, where, query, getDocs, onSnapshot
} from '@angular/fire/firestore';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
// import DocumentReference = firebase.firestore.DocumentReference;
// import CollectionReference = firebase.firestore.CollectionReference;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly _firebaseDBUrl = environment.firebase.databaseURL
  readonly _dbPath = 'userInfo'
  // userInfoRef: AngularFireList<UserInfo>
  private firestore: Firestore = inject(Firestore)
  userInfo$: Observable<UserInfo>
  // private userInfoCollection: CollectionReference

  constructor(
    private http: HttpClient,
  ) {
    // this.userInfoCollection = collection(this.firestore, this._dbPath)
  }

  createUserInfo(userInfo: UserInfo) {
    addDoc(collection(this.firestore, this._dbPath), userInfo).then((docRef) => {
      collection(this.firestore, `userInfo${docRef.id}`)
      setDoc(docRef, {...userInfo, id: docRef.id})
      return docRef
    })
  }

  // create(user: User): Observable<User> {
  //   // const {loginType} = user;
  //   return this.http.post(`${this._firebaseDBUrl}/users.json`, user)
  //     .pipe(
  //       map((res: FirebaseAuthResponse) => {
  //         if(loginType === 'email&password'){
  //           return {
  //             ...user,
  //             userId: res.localId
  //           }
  //         } else {
  //           return {
  //             ...user,
  //           }
  //         }
  //       })
  //     )
  // }

  // addUserInfo(userInfo: UserInfo): Observable<any> {
  //   return this.http.post(`${this._firebaseDBUrl}/userInfo.json`, userInfo)
  // }

  updateUserInfo(userInfo: UserInfo) {
    const ref = doc(this.firestore, `userInfo/${userInfo.id}`)

    return updateDoc(ref, {...userInfo})
    // return this.http.patch(`${this._firebaseDBUrl}/userInfo/${userInfoId}.json`, userInfo)
  }

  getUserInfoById(userId: string) {
    const userInfoCollection = collection(this.firestore, 'userInfo')
    // const ref = doc(this.firestore, 'userInfo')
    const q = query(userInfoCollection, where("userId", "==", userId))
    // return onSnapshot(q, (querySnapShot) => {
    //   console.log({querySnapShot})
    //   return querySnapShot
    // })
    // return docData(ref, {idField: 'userId'}) as Observable<UserInfo>
    // return docData(doc(this.firestore, 'userInfo'), {idField:  'userId'}) as  Observable<UserInfo>
    return getDocs(q)
  }

  // getUserInfoById(userId: string): Observable<any> {
  //   console.log(userId)
  //   return this.http.get<UserInfo>(`${this._firebaseDBUrl}/userInfo.json?orderBy="userId"&startAt="${userId}"&endAt="${userId}\uf8ff"`)
  //     .pipe(
  //       map((res: {[key: string]: any}) => {
  //         console.log({res})
  //         return Object
  //           .keys(res)
  //           .map(key => {
  //             return {
  //               ...res[key],
  //               userInfoId: key
  //             }
  //           })
  //       })
  //     )
  // }

  // getUserById(userId: string): Observable<any> {
  //   return this.http.get<User>(`${this._firebaseDBUrl}/users.json?orderBy="userId"&startAt="${userId}"&endAt="${userId}\uf8ff"`)
  //     .pipe(
  //       map((res: {[key: string]: any}) => {
  //         return Object
  //           .keys(res)
  //           .map(key => {
  //             return {
  //               ...res[key]
  //             }
  //           })
  //       })
  //     )
  // }
}


