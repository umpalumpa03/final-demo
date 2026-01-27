import { Routes } from '@angular/router';

export const signInRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./sign-in').then((c) => c.SignIn),
  },
  {
        path: 'sign-in/otp-verify',
        loadComponent: () =>
          import('../shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
      },
];
