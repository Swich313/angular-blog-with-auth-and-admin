import {Post} from "../shared/interfaces";

export interface Environment {
  production: boolean;
  apiKey: string;
  fbDbUrl: string;
  cloudinaryUrl: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;

  mockedPosts?: Post[]
}
