import {Post} from "../shared/interfaces";

export interface Environment {
  production: boolean;
  firebase: {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
  };


  cloudinaryUrl: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;

  facebookAppID: string;
  googleAppClientID: string;

  defaultAvatarUrl?: string;
  mockedPosts?: Post[]
}
