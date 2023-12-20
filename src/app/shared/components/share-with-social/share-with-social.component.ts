import {Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {faFacebook, faInstagram, faTelegram, faTwitter, faViber} from "@fortawesome/free-brands-svg-icons";
import {WindowService} from "../../services/window.service";
import {ShareSocialMedia} from "../../interfaces";
import {faQrcode, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {ModalService} from "../../services/modal.service";
import {BehaviorSubject, from, map, mergeMap, Observable, switchMap, tap} from "rxjs";
import {QRCodeComponent} from "angularx-qrcode";
import {QrCodeComponent} from "../qr-code/qr-code.component";

@Component({
  selector: 'app-share-with-social',
  templateUrl: './share-with-social.component.html',
  styleUrls: ['./share-with-social.component.scss']
})
export class ShareWithSocialComponent implements OnInit{
  facebookIcon = faFacebook
  twitterIcon = faTwitter
  instagramIcon = faInstagram
  qrIcon = faQrcode
  telegramIcon = faTelegram
  viberIcon = faViber
  currentUrl: string = ''
  public socialMedia: ShareSocialMedia[]

  @Input()
  title: string

  private lazyLoadsQRCodeComponent$ = from(
    import('../qr-code/qr-code.component')
      .then(component => component.QrCodeComponent)
  )

  constructor(
    public dialog: MatDialog,
    private windowService: WindowService,
    private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.currentUrl = this.windowService.windowRef.location.href
    this.socialMedia = [
      {name: 'facebook', icon: this.facebookIcon, url: `https://www.facebook.com/sharer.php?u=${this.currentUrl}`},
      {name: 'twitter', icon: this.twitterIcon, url: `https://twitter.com/intent/tweet?url=${this.currentUrl}`},
      // {name: 'instagram', icon: this.instagramIcon, url: '/instagram'},
      {name: 'telegram', icon: this.telegramIcon, url: `https://telegram.me/share/url?url=${this.currentUrl}&text=${this.title}`},
      {name: 'viber', icon: this.viberIcon, url: `https://viber://forward?text=${encodeURIComponent(this.title + " " + this.currentUrl)}`},
      // {name: 'qr-code', icon: this.qrIcon, url: '#'},
    ]
  }

  openDialog() {
    const dialogRef = this.modalService.showDialog(this.lazyLoadsQRCodeComponent$,'Your QR Code')
  }
}
