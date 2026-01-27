import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const signUpGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  
  const currSignUpToken = tokenService.getSignUpToken;
  if (currSignUpToken) {
    return true;
  }

  return false;
};
