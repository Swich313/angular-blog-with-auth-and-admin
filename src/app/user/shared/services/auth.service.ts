import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

export type AuthMode = 'login' | 'signup'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: any = false;

  constructor(private router: Router) { }

  authMode(): AuthMode {
    return this.router.url === '/author/auth/login' ? 'login' : 'signup'
  }

  login(): void {
    this.isAuth = true;
    this.router.navigate(['/author', 'dashboard'])
  }

  logout(): void {
    this.isAuth = false
    this.router.navigate(['/author', 'auth', 'login'])
  }
}
