import {IconDefinition} from "@fortawesome/free-regular-svg-icons";
import {Timestamp} from "@angular/fire/firestore";

export interface Post {
  id?: string;
  title: string;
  text: string;
  imageUrl: string | File;
  tags?: string;
  author: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  userId?: string;
}

export interface ShareSocialMedia {
  name: string;
  icon: IconDefinition;
  url: string;
}

export interface PostQueryParams {
  orderByField: 'author' | 'title' | 'createdAt';
  ascOrDesc: 'asc' | 'desc';
  limitPosts: number;
  start: number
}

// export interface User {
//   email: string;
//   password: string;
//   returnSecureToken?: boolean;
//   userId?: string;
//   loginType: 'email&password' | 'facebook' | 'google'
// }

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
}

export interface UserInfo {
  userId: string;
  avatarUrl: string;
  name: string;
  birthday: string;
  gender: 'male' | 'female' | '';
  id?: string;
}

export interface FirebaseAuthResponse {
  idToken: string;
  expiresIn: string;
  localId: string;
  email?: string;
  password?: string;
}

export interface FirebaseCreateResponse {
  name: string
}

export function instanceOfFirebaseAuthResponse(object: any): object is FirebaseAuthResponse{
  if(object == null){
    return null
  } else {
    return object.includes('expiresIn') && object.includes('idToken') && object.includes('localId')
  }
}
