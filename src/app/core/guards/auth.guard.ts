import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authCheckComplete$.pipe(
    filter(complete => complete === true),
    take(1),
    switchMap(() => authService.isAuthenticated$),
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      router.navigate(['/auth/login']);
      return false;
    })
  );
};

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authCheckComplete$.pipe(
    filter(complete => complete === true),
    take(1),
    switchMap(() => authService.isAuthenticated$),
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }

      router.navigate(['/dashboard']);
      return false;
    })
  );
};
