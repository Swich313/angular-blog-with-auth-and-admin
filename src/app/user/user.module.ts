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
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {HttpClientModule} from "@angular/common/http";
import {AlertService} from "./shared/services/alert.service";
import {AuthService} from "./shared/services/auth.service";
import {QuillModule} from "ngx-quill";
import {FileUploadModule} from "ng2-file-upload";
import { ProfileComponent } from './profile/profile.component';
import {authGuard} from "./shared/guards/auth.guard";

@NgModule({
  declarations: [
    CreatePostPageComponent,
    EditPostPageComponent,
    DashboardPageComponent,
    AuthPageComponent,
    UserLayoutComponent,
    AlertComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: UserLayoutComponent, children: [
          {path: '', redirectTo: '/author/auth', pathMatch: 'full'},
          {path: 'auth', redirectTo: '/author/auth/login', pathMatch: 'full'},
          {path: 'auth/:authType', component: AuthPageComponent},
          {path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard]},
          {path: 'create', component: CreatePostPageComponent, canActivate: [authGuard]},
          {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
          {path: 'post/:id/edit', component: EditPostPageComponent, canActivate: [authGuard]}
        ]
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    QuillModule.forRoot(),
    FileUploadModule
  ],
  providers: [AlertService, AuthService],
  exports: [RouterModule]
})
export class UserModule { }
