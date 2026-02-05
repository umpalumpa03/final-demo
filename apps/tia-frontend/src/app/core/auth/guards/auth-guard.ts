import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of, take } from 'rxjs';
import { Routes } from '../models/tokens.model';
import { TokenService } from '../services/token.service';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';

export const AuthGuard: CanActivateChildFn = () => {
  const userInfoService = inject(UserInfoService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.refreshToken || !tokenService.accessToken) {
    router.navigate([Routes.SIGN_IN])
  }

  return userInfoService.getUserInfo().pipe(
    map((res) => (res ? true : false)),
    catchError(() => {
      return of(router.createUrlTree([Routes.SIGN_IN]));
    }),
    take(1),
  );
};
