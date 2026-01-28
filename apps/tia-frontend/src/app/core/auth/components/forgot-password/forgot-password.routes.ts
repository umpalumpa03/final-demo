import { Routes } from '@angular/router';

export const forgotPasswordSegments = {
  base: ['forgot-password'],
  otp: ['forgot-password', 'otp'],
  reset: ['forgot-password', 'reset'],
  success: ['forgot-password', 'success'],
};

export const forgotPasswordRoutes: Routes = [
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './forgot-password-email/forgot-password-email'
      ).then(
        (c) => c.ForgotPasswordEmail,
      ),
  },
  {
    path: 'forgot-password/reset',
    loadComponent: () =>
      import('./reset-password/reset-password').then(
        (c) => c.ResetPassword,
      ),
  },
  {
    path: 'forgot-password/success',
    loadComponent: () =>
      import('./reset-success/reset-success').then(
        (c) => c.ResetSuccess,
      ),
  },
];
