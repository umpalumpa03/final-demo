import { Routes } from '@angular/router';
import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up').then((c) => c.SignUp),
  },
  { 
    path: 'sign-up/phone',
    // canActivate: [signUpGuard],
    loadComponent: () => import('./phone-verification/phone-verification').then(c => c.PhoneVerification)
  },
  {
    path: 'sign-up/otp-verify',
    loadComponent: () => import('../shared/otp-verification/otp-verification').then(c => c.OtpVerification)
  },
  {
    path: 'sign-up/success',
    loadComponent: () => import('../shared/success-page/success-page').then(c => c.SuccessPage)
  }
];