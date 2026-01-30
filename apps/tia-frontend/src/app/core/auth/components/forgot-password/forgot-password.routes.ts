import { Routes } from '@angular/router';

export const forgotPasswordSegments = {
  base: ['forgot-password'],
  otp: ['verify-otp-reset'],
  reset: ['reset-password'],
  success: ['success'],
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
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../forgot-password/reset-password/reset-password').then(
        (c) => c.ResetPassword,
      ),
  },
  {
    path: 'success',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
];
