import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import {ShowClosePasswordDirective} from "./directives/show-close-password.directive";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';



@NgModule({
  declarations: [
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    QuillModule.forRoot(),
    FontAwesomeModule
  ],
  exports: [
    HttpClientModule,
    QuillModule,
    FontAwesomeModule,
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent
  ]
})
export class SharedModule { }
