import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import {ShowClosePasswordDirective} from "./directives/show-close-password.directive";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";



@NgModule({
  declarations: [ShowClosePasswordDirective],
  imports: [
    HttpClientModule,
    QuillModule.forRoot(),
    FontAwesomeModule
  ],
  exports: [
    HttpClientModule,
    QuillModule,
    FontAwesomeModule,
    ShowClosePasswordDirective
  ]
})
export class SharedModule { }
