import { Routes } from '@angular/router';
import { OtpVerifyGuard } from '../../guards/otp-verify-guard';
import { PhoneGuard } from '../../guards/phone.guard';

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
      canActivate: [PhoneGuard]
  },
  {
    path: 'verify-otp-register',
    loadComponent: () =>
      import('./verify-signup/verify-signup').then((c) => c.VerifySignup),
    // canActivate: [OtpVerifyGuard]
  },
];
