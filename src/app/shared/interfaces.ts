import {IconDefinition} from "@fortawesome/free-regular-svg-icons";

export interface Post {
  id?: string;
  title: string;
  text: string;
  imageUrl: string | File;
  tags?: string;
  author: string;
  date: Date;
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
  name?: string;
}

export interface FirebaseAuthResponse {
  idToken: string;
  expiresIn: string;
}

export interface FirebaseCreateResponse {
  name: string
}
