import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateChildFn = () => {
  const tokenService = inject(TokenService);
  const authTokens = tokenService.accessToken || tokenService.refreshToken;

  return authTokens ? false : true;
};
