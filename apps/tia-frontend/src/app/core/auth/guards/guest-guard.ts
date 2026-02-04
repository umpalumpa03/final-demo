import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Routes } from '../models/tokens.model';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const GuestGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.refreshToken || !tokenService.accessToken) {
    return true;
  }

  return authService
    .refreshTokenPostRequest({ refresh_token: tokenService.refreshToken })
    .pipe(
      map(() => {
        authService.isAuthenticated.set(true);
        return router.createUrlTree([Routes.DASHBOARD]);
      }),
      catchError(() => {
        authService.logoutSideEffects();
        return of(true);
      }),
    );
};
