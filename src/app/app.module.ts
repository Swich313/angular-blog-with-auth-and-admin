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
import {AuthorInfoComponent} from "./author-info/author-info.component";

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore} from '@angular/fire/firestore';
import {environment} from "./environments/environment";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireModule} from "@angular/fire/compat";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {SearchAndSortComponent} from "./shared/components/search-and-sort/search-and-sort.component";
import {FormsModule} from "@angular/forms";

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
        AuthorInfoComponent,
        SearchAndSortComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore()
      // if(location.hostname === 'localhost') {
      //   connectFirestoreEmulator(firestore, 'http://127.0.0.1', 8080)
      // }
      return firestore
    }),
    provideFunctions(() => {
      const functions  = getFunctions()
      // if(location.hostname === 'localhost') {
      //   connectFunctionsEmulator(functions, 'http://127.0.0.1', 5001)
      // }
      return functions
    }),
    provideStorage(() => {
      const storage = getStorage()
      // if(location.hostname === 'localhost') {
      //   connectStorageEmulator(storage, 'http://127.0.0.1', 9199)
      // }
      return storage
    }),
    provideAuth(() => {
      const auth = getAuth()
      // if(location.hostname === 'localhost') {
      //   connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings:  true })
      // }
      return auth
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
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
