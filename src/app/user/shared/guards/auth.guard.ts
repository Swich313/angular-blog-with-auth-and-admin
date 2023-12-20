import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  console.log("log from AuthGuard:::isAuth = ", authService.isAuth)
  if(!authService.isAuth){
    return router.navigate(['/author', 'auth', 'login'], {
      queryParams: {auth: false}
    })
  }
  return true
};
