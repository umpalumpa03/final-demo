import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const signUpGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)

  // TEST!!
  const currSignUpToken = tokenService.getSignUpToken || tokenService.verifyToken;
  
  if (currSignUpToken) {
    return true;
  }

  return false;
};
