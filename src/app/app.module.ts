import {NgModule, Provider, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from "@angular/router";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PostComponent } from './shared/components/post/post.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PostSkeletonComponent } from './shared/components/post-skeleton/post-skeleton.component';
import {WindowService} from "./shared/services/window.service";
import { ShareWithSocialComponent } from './shared/components/share-with-social/share-with-social.component';
import {SharedModule} from "./shared/shared.module";
import {AuthService} from "./user/shared/services/auth.service";
import {AlertService} from "./user/shared/services/alert.service";
import {provideHotToastConfig} from "@ngneat/hot-toast";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PaginatorComponent} from "./shared/components/paginator/paginator.component";


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
    ShareWithSocialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    WindowService,
    AuthService,
    AlertService,
    provideHotToastConfig()
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
