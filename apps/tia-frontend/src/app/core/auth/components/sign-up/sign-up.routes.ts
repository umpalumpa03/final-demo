import { Routes } from '@angular/router';

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
      import('../../shared/otp-verification/otp-verification').then(
        (c) => c.OtpVerification,
      ),
  },
];
