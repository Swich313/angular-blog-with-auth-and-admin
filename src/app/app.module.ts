import {NgModule, Provider, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from "@angular/router";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PostComponent } from './shared/components/post/post.component';
import {environment} from "./environments/environment";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PostSkeletonComponent } from './shared/components/post-skeleton/post-skeleton.component';
import {WindowService} from "./shared/services/window.service";
import {HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import { ShareWithSocialComponent } from './shared/components/share-with-social/share-with-social.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ShowClosePasswordDirective } from './shared/directives/show-close-password.directive';
import {SharedModule} from "./shared/shared.module";
import {CloudinaryModule} from "@cloudinary/ng";
import {AuthService} from "./user/shared/services/auth.service";
import {AlertService} from "./user/shared/services/alert.service";


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    PostComponent,
    NotFoundPageComponent,
    FooterComponent,
    PostSkeletonComponent,
    ShareWithSocialComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [WindowService, AuthService, AlertService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
