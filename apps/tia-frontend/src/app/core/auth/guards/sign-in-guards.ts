import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Routes } from '../models/tokens.model';

export const SignInGuard: CanActivateChildFn = () => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated =
    tokenService.accessToken &&
    tokenService.refreshToken &&
    authService.getChallengeId();

  return isAuthenticated ? router.createUrlTree([Routes.DASHBOARD]) : true;
};
