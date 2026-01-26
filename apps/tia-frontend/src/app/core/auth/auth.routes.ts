import { Routes } from '@angular/router';
import { signUpRoutes } from './components/sign-up/sign-up.routes';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./container/auth-container').then((c) => c.AuthContainer),
    children: [
      { 
        path: 'sign-in', 
        loadComponent: () => import('./components/sign-in/sign-in').then(c => c.SignIn) 
      }, 
      ...signUpRoutes,
      { path: '**', redirectTo: 'sign-in' }
    ]
  }
];