import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./container/auth-container').then((c) => c.AuthContainer),
    children: [
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./components/sign-in/sign-in.routes').then(
            (c) => c.signInRoutes,
          ),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('./components/sign-up/sign-up.routes').then(
            (c) => c.signUpRoutes,
          ),
      },
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
      },
      {
        path: 'verify-otp-reset',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
      },
      {
        path: 'verify-otp-register',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
      },
      {
        path: 'phone',
        loadComponent: () =>
          import(
            './components/sign-up/phone-verification/phone-verification'
          ).then((c) => c.PhoneVerification),
      },
      {
        path: 'register-success',
        loadComponent: () =>
          import('./components/shared/success-page/success-page').then(
            (c) => c.SuccessPage,
          ),
      },
      {
        path: 'signup-success',
        loadComponent: () =>
          import('./components/shared/success-page/success-page').then(
            (c) => c.SuccessPage,
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './components/forgot-password/forgot-password-email/forgot-password-email'
          ).then((c) => c.ForgotPasswordEmail),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import(
            './components/forgot-password/reset-password/reset-password'
          ).then((c) => c.ResetPassword),
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: '**', redirectTo: 'sign-in' },
    ],
  },
];
