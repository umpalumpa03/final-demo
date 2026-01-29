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
      import('./forgot-password-email/forgot-password-email').then(
        (c) => c.ForgotPasswordEmail,
      ),
  },
  {
    path: 'verify-otp-reset',
    loadComponent: () =>
      import(
        '../forgot-password/forgot-password-verify/forgot-password-verify'
      ).then((c) => c.ForgotPasswordVerify),
  },
];
