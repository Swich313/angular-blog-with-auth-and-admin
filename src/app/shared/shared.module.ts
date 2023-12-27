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
import {QrCodeComponent} from "./components/qr-code/qr-code.component";
import {QRCodeModule} from "angularx-qrcode";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {PasswordStrengthComponent} from "./components/password-strength/password-strength.component";

@NgModule({
  declarations: [
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent,
    CopyToClipboardDirective,
    ModalComponent,
    PaginatorComponent,
    QrCodeComponent,
    PasswordStrengthComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    QuillModule.forRoot(),
    FontAwesomeModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    QRCodeModule,
    MatSortModule,
    MatTableModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    QuillModule,
    FontAwesomeModule,
    ShowClosePasswordDirective,
    SpinnerComponent,
    LoadingBarComponent,
    CopyToClipboardDirective,
    ModalComponent,
    PaginatorComponent,
    MatSortModule,
    MatTableModule,
    PasswordStrengthComponent
  ]
})
export class SharedModule { }
