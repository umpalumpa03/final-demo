import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Routes } from '../models/tokens.model';

export const ResetPasswordGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.accessToken && !tokenService.refreshToken
    ? true
    : router.navigate([Routes.SIGN_IN]);
};
