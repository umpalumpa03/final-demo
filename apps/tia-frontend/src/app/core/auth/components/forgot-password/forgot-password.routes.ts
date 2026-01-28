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
        'apps/tia-frontend/src/app/core/auth/components/forgot-password/components/forgot-password-email/forgot-password-email'
      ).then(
        (c) => c.ForgotPasswordEmail,
      ),
  },
  {
    path: 'forgot-password/otp',
    loadComponent: () =>
      import(
        './components/forgot-password-otp/forgot-password-otp'
      ).then(
        (c) => c.ForgotPasswordOtp,
      ),
  },
  {
    path: 'forgot-password/reset',
    loadComponent: () =>
      import('./components/reset-password/reset-password').then(
        (c) => c.ResetPassword,
      ),
  },
  {
    path: 'forgot-password/success',
    loadComponent: () =>
      import('./components/reset-success/reset-success').then(
        (c) => c.ResetSuccess,
      ),
  },
];
