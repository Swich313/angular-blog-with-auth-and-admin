import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { CreatePostPageComponent } from './create-post-page/create-post-page.component';
import { EditPostPageComponent } from './edit-post-page/edit-post-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { UserLayoutComponent } from './shared/components/user-layout/user-layout.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {authGuard} from "./shared/guards/auth.guard";
import {SharedModule} from "../shared/shared.module";
import {FileUploadModule} from "ng2-file-upload";
import {MatButtonModule} from "@angular/material/button";
import {OAuthModule} from "./o-auth.module";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {VerifyEmailComponent} from "./verify-email/verify-email.component";
import {AuthService} from "./shared/services/auth.service";
import {UserService} from "./profile/shared/services/user.service";

@NgModule({
  declarations: [
    CreatePostPageComponent,
    EditPostPageComponent,
    DashboardPageComponent,
    AuthPageComponent,
    UserLayoutComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: UserLayoutComponent, children: [
          {path: '', redirectTo: '/author/auth', pathMatch: 'full'},
          {path: 'auth', redirectTo: '/author/auth/login', pathMatch: 'full'},
          {path: 'auth/:authType', component: AuthPageComponent},
          {path: 'auth/login/reset-password', component: ResetPasswordComponent, pathMatch: 'full'},
          {path: 'auth/login/verify-email', component: VerifyEmailComponent, pathMatch: 'full'},
          {path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard]},
          {path: 'create', component: CreatePostPageComponent, canActivate: [authGuard]},
          {path: 'post/:id/edit', component: EditPostPageComponent, canActivate: [authGuard]},
          {
            path: 'profile',
            loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule),
            canActivate: [authGuard]
          }
        ]
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    MatButtonModule,
    OAuthModule
  ],
  providers: [AuthService, UserService],
  exports: [RouterModule]
})
export class UserModule { }
