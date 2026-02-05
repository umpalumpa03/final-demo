import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Routes } from '../models/tokens.model';
import { TokenService } from '../services/token.service';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { catchError, EMPTY, map, of, take } from 'rxjs';

export const GuestGuard: CanActivateChildFn = () => {
  const userInfoService = inject(UserInfoService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.refreshToken || !tokenService.accessToken) {
    return true;
  }

  return userInfoService.getUserInfo().pipe(
    map((res) => (res ? router.createUrlTree([Routes.DASHBOARD]) : true)),
    catchError(() => {
      return of(router.createUrlTree([Routes.SIGN_IN]));
    }),
    take(1),
  );
};
