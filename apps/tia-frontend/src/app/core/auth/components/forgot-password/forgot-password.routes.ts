import { Routes } from '@angular/router';

export const forgotPasswordRoutes: Routes = [
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password-email/forgot-password-email').then(
        (c) => c.ForgotPasswordEmail,
      ),
  },
  {
    path: 'forgot-password/otp',
    loadComponent: () =>
      import('../shared/otp-verification/otp-verification').then(
        (c) => c.OtpVerification,
      ),
    data: { otpContext: 'forgot-password' },
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
