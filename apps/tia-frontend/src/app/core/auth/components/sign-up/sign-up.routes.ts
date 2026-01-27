import { Routes } from '@angular/router';
import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  { 
    path: 'sign-up',
    loadComponent: () => import('./sign-up').then(c => c.SignUp)
  },
  { 
    path: 'sign-up/otp',
    // canActivate: [signUpGuard],
    loadComponent: () => import('./phone-verification/phone-verification').then(c => c.PhoneVerification)
  }
];