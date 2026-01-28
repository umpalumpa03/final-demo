import { Routes } from '@angular/router';

export const signInRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sign-in').then((c) => c.SignIn),
    data: {
      sidePanel: {
        title: 'Welcome Back!',
        description: 'Sign in to continue to your account and access all features.',
        features: [
          { id: 1, title: 'Secure Authentication', text: 'Two-factor verification for enhanced security', icon: 'images/svg/alerts/base-alert-success.svg' },
          { id: 2, title: 'Protected Data', text: 'Your information is encrypted and safe', icon: 'images/svg/alerts/base-alert-success.svg' },
        ],
      },
    },
  },
];
