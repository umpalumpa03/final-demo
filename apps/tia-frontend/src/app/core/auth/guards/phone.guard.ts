import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Routes } from '../models/tokens.model';
import { TokenService } from '../services/token.service';

export const PhoneGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.getSignUpToken || tokenService.verifyToken
    ? true
    : router.createUrlTree([Routes.SIGN_IN]);
};
