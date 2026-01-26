import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./container/auth-container').then((c) => c.AuthContainer),
    children: [
      { 
        path: 'sign-in', 
        loadComponent: () => import('./components/sign-in/sign-in').then(c => c.SignIn) 
      }, 
      { 
        path: 'sign-up',  
        loadComponent: () => import('./components/sign-up/components/sign-up').then(c => c.SignUp)
      },
      {
        path: 'otp-verify',
        loadComponent: () => import('./components/shared/otp-verification/otp-verification').then(c => c.OtpVerification)
      },
      {
        path: 'phone-verify',
        loadComponent: () => import('./components/shared/otp-verification/otp-verification').then(c => c.OtpVerification)
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      
      { path: '**', redirectTo: 'sign-in' }
    ]
  }
];