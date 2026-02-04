import { Routes } from '@angular/router';
import { OtpVerifyGuard } from '../../guards/otp-verify-guard';

export const signInRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in').then((c) => c.SignIn),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./verify-signin/verify-signin').then(
        (c) => c.VerifySignin,
      ),
      // canActivate: [OtpVerifyGuard]
  },
];
