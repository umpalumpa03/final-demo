import { Routes } from '@angular/router';
import { signInRoutes } from './components/sign-in/sign-in.routes';
import { forgotPasswordRoutes } from './components/forgot-password/forgot-password.routes';
import { signUpRoutes } from './components/sign-up/sign-up.routes';
import { GuestGuard } from './guards/guest-guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./container/auth-container').then((c) => c.AuthContainer),
    canActivateChild: [GuestGuard],
    children: [
      ...signInRoutes,
      ...forgotPasswordRoutes,
      ...signUpRoutes,
      {
        path: 'error-info',
        loadComponent: () =>
          import('./shared/error-page/error-page').then((c) => c.ErrorPage),
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: '**', redirectTo: 'sign-in' },
    ],
  },
];
