import { Routes } from '@angular/router';
// import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sign-up').then((c) => c.SignUp),
  },
  {
    path: 'verify-otp-register',
    loadComponent: () =>
      import('../shared/otp-verification/otp-verification').then(
        (c) => c.OtpVerification,
      ),
  },
];
