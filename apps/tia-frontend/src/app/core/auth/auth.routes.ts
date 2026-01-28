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
        path: 'otp-verify',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
        data: {
          sidePanel: {
            title: 'Verify Your Identity',
            description: 'Enter the code sent to your email.',
            features: [
              {
                id: 1,
                title: 'Fast Signup',
                text: 'Create an account in minutes',
              },
              { id: 2, title: 'Secure', text: 'We protect your data' },
            ],
          },
        },
      },
      {
        path: 'phone',
        loadComponent: () =>
          import(
            './components/sign-up/phone-verification/phone-verification'
          ).then((c) => c.PhoneVerification),
        data: {
          sidePanel: {
            title: 'Verify Phone',
            description: 'We’ll send you a verification code.',
            features: [
              { id: 1, title: 'SMS Verification', text: 'Get a code via SMS' },
              { id: 2, title: 'Quick', text: 'Verify in seconds' },
            ],
          },
        },
      },
      {
        path: 'otp',
        loadComponent: () =>
          import('./components/shared/otp-verification/otp-verification').then(
            (c) => c.OtpVerification,
          ),
        data: {
          sidePanel: {
            title: 'Confirm Your Account',
            description: 'Enter the OTP to continue.',
            features: [
              { id: 1, title: 'One-time Code', text: 'Secure one-time code' },
              { id: 2, title: 'No Passwords', text: 'Only enter the code' },
            ],
          },
        },
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./components/shared/success-page/success-page').then(
            (c) => c.SuccessPage,
          ),
        data: {
          sidePanel: {
            title: 'Success',
            description: 'Your account has been created.',
            features: [
              { id: 1, title: 'Welcome', text: 'Your account is ready' },
              { id: 2, title: 'Get Started', text: 'Explore features now' },
            ],
          },
        },
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './components/forgot-password/components/forgot-password-email/forgot-password-email'
          ).then((c) => c.ForgotPasswordEmail),
        data: {
          sidePanel: {
            title: 'Success',
            description: 'Your account has been created.',
            features: [
              { id: 1, title: 'Welcome', text: 'Your account is ready' },
              { id: 2, title: 'Get Started', text: 'Explore features now' },
            ],
          },
        },
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import(
            './components/forgot-password/components/reset-password/reset-password'
          ).then((c) => c.ResetPassword),
        data: {
          sidePanel: {
            title: 'Success',
            description: 'Your account has been created.',
            features: [
              { id: 1, title: 'Welcome', text: 'Your account is ready' },
              { id: 2, title: 'Get Started', text: 'Explore features now' },
            ],
          },
        },
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: '**', redirectTo: 'sign-in' },
    ],
  },
];
