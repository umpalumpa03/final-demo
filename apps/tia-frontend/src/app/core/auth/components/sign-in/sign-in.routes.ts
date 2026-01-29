import { Routes } from '@angular/router';

export const signInRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sign-in').then((c) => c.SignIn),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('../shared/otp-verification/otp-verification').then(
        (c) => c.OtpVerification,
      ),
  },
];
