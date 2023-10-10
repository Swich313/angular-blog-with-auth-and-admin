import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import {AuthService} from "../admin/shared/services/auth.service";



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    QuillModule.forRoot(),

  ],
  exports: [
    HttpClientModule,
    QuillModule
  ]
})
export class SharedModule { }
