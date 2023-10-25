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


@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        HomePageComponent,
        PostPageComponent,
        PostComponent,
        NotFoundPageComponent,
        FooterComponent,
        PostSkeletonComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        FontAwesomeModule,
    ],
    providers: [WindowService],
    bootstrap: [AppComponent]
})
export class AppModule { }
