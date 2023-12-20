import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialLoginModule,
  SocialAuthServiceConfig, FacebookLoginProvider
} from "@abacritt/angularx-social-login";

import {environment} from "../environments/environment";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleAppClientID)
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookAppID)
          }
        ],
        onError: (err) => {
          console.error(err)
        }
      } as SocialAuthServiceConfig
    }
  ],
  exports: [
    SocialLoginModule,
    GoogleSigninButtonModule
  ]
})
export class OAuthModule { }
