import { Routes } from '@angular/router';
import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up').then((c) => c.SignUp),
  },
  {
    path: 'sign-up/otp',
    canActivate: [signUpGuard],
    loadComponent: () =>
      import('../shared/otp-verification/otp-verification').then(
        (c) => c.OtpVerification,
      ),
    data: { otpContext: 'sign-up' },
  },
];