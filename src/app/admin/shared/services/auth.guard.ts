import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

import {AuthService} from "./auth.service";


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
    if (authService.isAuth()) {
      return true;
    } else {
      authService.logout()
      return router.navigate(['/admin', 'login'], {
        queryParams: {auth: false}
      })
    }
};
