import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import {ShowClosePasswordDirective} from "./directives/show-close-password.directive";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { ModalComponent } from './components/modal/modal.component';
import {AngularMaterialModule} from "./angular-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {PaginatorComponent} from "./components/paginator/paginator.component";

@NgModule({
  declarations: [
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent,
    CopyToClipboardDirective,
    ModalComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    QuillModule.forRoot(),
    FontAwesomeModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    HttpClientModule,
    QuillModule,
    FontAwesomeModule,
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent,
    CopyToClipboardDirective,
    ModalComponent,
    PaginatorComponent
  ]
})
export class SharedModule { }
