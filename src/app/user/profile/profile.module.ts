import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './shared/components/profile-layout/profile-layout.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { PasswordPageComponent } from './password-page/password-page.component';
import {RouterModule} from "@angular/router";
import { SocialMediaPageComponent } from './social-media-page/social-media-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { OtherPageComponent } from './other-page/other-page.component';
import {FileUploadModule} from "ng2-file-upload";
import {CloudinaryModule} from "@cloudinary/ng";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {GeneratePasswordComponent} from "./shared/components/generate-password/generate-password.component";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {UserService} from "./shared/services/user.service";



@NgModule({
  declarations: [
    ProfileLayoutComponent,
    ProfilePageComponent,
    PasswordPageComponent,
    SocialMediaPageComponent,
    PrivacyPageComponent,
    OtherPageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: ProfileLayoutComponent, children: [
                    {path: '', component: ProfilePageComponent, pathMatch: 'full'},
                    {path: 'password', component: PasswordPageComponent},
                    {path: 'social', component: SocialMediaPageComponent},
                    {path: 'privacy', component: PrivacyPageComponent},
                    {path: 'other', component: OtherPageComponent}
                ]
            }
        ]),
        FileUploadModule,
        CloudinaryModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatButtonModule,
        AngularFireDatabaseModule
    ],
  providers: []
})
export class ProfileModule { }
