import {AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit, AfterContentChecked{
  authMode: any
  authModeSub: Subscription
  checkbox: HTMLInputElement

  get isLoginPage(): boolean {
    const url = this.router.url
    return url.includes('auth') && (this.authMode === 'login' || this.authMode === 'signup')
  }

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    private elRef: ElementRef,
    private cdref: ChangeDetectorRef
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.checkbox?.checked) {
        this.checkbox.checked = !this.checkbox.checked
      }
    })
  }

  logout($event: Event): void {
    $event.preventDefault()
    this.authService.logout()
  }

  ngOnInit(): void {
    // this.authMode = this.router.url.split('/').at(-1)
    this.authService.data$.subscribe(data => {
      this.authMode = data
      console.log({data})
    })
    console.log('user-layout authMode', this.authMode)
    this.checkbox = this.elRef.nativeElement.querySelector('#checkbox')
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges()
  }


  onclick() {
    console.log('chechbox', this.checkbox.checked = !this.checkbox.checked)
  }
}
