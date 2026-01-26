import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const signUpGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  
  const currSignUpToken = tokenService.getSignUpToken;
  // RESET LOCAL SIGNUP TOKEN
  if (currSignUpToken) {
    return true;
  }

  console.warn('Guard failed, redirecting...');
  return false;
};
