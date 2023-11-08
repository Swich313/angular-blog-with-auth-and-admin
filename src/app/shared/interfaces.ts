import {IconDefinition} from "@fortawesome/free-regular-svg-icons";

export interface Post {
  id?: string;
  title: string;
  text: string;
  imageUrl: string | File;
  tags?: string;
  author: string;
  date: Date;
  userId?: string;
}

export interface ShareSocialMedia {
  name: string;
  icon: IconDefinition;
  url: string;
}

export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
  userId?: string;
}

export interface UserInfo {
  userId?: string;
  avatarUrl: string;
  name: string;
  birthday: string;
  gender: 'male' | 'female'
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
