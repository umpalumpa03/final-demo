import { Routes } from '@angular/router';
import { PhoneVerificationGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up').then((c) => c.SignUp),
  },
  {
    path: 'phone',
    loadComponent: () =>
      import('../sign-up/phone-verification/phone-verification').then(
        (c) => c.PhoneVerification,
      ),
  },
  {
    path: 'verify-otp-register',
    loadComponent: () =>
      import('./verify-signup/verify-signup').then((c) => c.VerifySignup),
  },
];
