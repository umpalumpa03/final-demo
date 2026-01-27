import { Routes } from '@angular/router';
import { signUpRoutes } from './components/sign-up/sign-up.routes';
import { signInRoutes } from './components/sign-in/sign-in.routes';
import { forgotPasswordRoutes } from './components/forgot-password/forgot-password.routes';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./container/auth-container').then((c) => c.AuthContainer),
    children: [
      ...signInRoutes,
      ...signUpRoutes,
      ...forgotPasswordRoutes,
      {
        path: 'otp-verify',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
        data: { otpContext: 'sign-in' },
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },

      { path: '**', redirectTo: 'sign-in' },
    ],
  },
];
