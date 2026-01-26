import { Routes } from '@angular/router';
import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  { 
    path: 'sign-up',
    loadComponent: () => import('./components/sign-up').then(c => c.SignUp)
  },
  { 
    path: 'sign-up/otp',
    canActivate: [signUpGuard],
    loadComponent: () => import('./components/otp-verification/otp-verification').then(c => c.OtpVerification)
  }
];