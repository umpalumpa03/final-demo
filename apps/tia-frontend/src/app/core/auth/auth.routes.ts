import { Routes } from '@angular/router';
import { signInRoutes } from './components/sign-in/sign-in.routes';
import { forgotPasswordRoutes } from './components/forgot-password/forgot-password.routes';
import { signUpRoutes } from './components/sign-up/sign-up.routes';
import { AuthGuard } from './guards/auth-guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./container/auth-container').then((c) => c.AuthContainer),
    // canActivateChild: [AuthGuard],
    children: [
      ...signInRoutes,
      ...forgotPasswordRoutes,
      ...signUpRoutes,
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: '**', redirectTo: 'sign-in' },
    ],
  },
];
