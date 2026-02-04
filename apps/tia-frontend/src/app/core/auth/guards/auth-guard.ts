import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Routes } from '../models/tokens.model';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.refreshToken || !tokenService.accessToken) {
    authService.logoutSideEffects();
    router.navigate([Routes.SIGN_IN])
    return of(false);
  }

  if (
    !tokenService.accessToken ||
    (tokenService.refreshToken && tokenService.accessToken)
  ) {
    return authService
      .refreshTokenPostRequest({
        refresh_token: tokenService.refreshToken!,
      })
      .pipe(
        map(() => {
          authService.isAuthenticated.set(true);
          return true;
        }),
        catchError(() => {
          authService.logoutSideEffects();
          return of(false);
        }),
      );
  }

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree([Routes.SIGN_IN]);
};
