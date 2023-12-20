import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {
  public postUrl: string

  constructor() {
    this.postUrl = document.documentURI;
  }
}
