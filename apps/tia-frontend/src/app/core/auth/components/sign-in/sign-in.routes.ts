import { Routes } from '@angular/router';

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
  },
];
