import {Component, OnInit} from '@angular/core';
import {AuthMode, AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AuthPageComponent} from "../../../auth-page/auth-page.component";

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit{
  authMode: AuthMode

  get isLoginPage(): boolean {
    return this.authMode === 'login' || this.authMode === 'signup'
  }

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
  }

  logout($event: Event): void {
    $event.preventDefault()
    this.authService.logout()
  }

  ngOnInit(): void {
    this.authMode = this.authService.authMode()
  }

  onOutletLoaded(component: AuthPageComponent) {
    component.authMode = this.authMode
  }
}
