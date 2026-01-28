import { Routes } from '@angular/router';
// import { signUpGuard } from '../../guards/sign-up-guard';

export const signUpRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sign-up').then((c) => c.SignUp),
    data: {
      sidePanel: {
        title: 'Join Us Today!',
        description: 'Join us in just a few steps.',
        features: [
          { id: 1, title: 'Fast Signup', text: 'Create an account in minutes' },
          { id: 2, title: 'Secure', text: 'We protect your data' },
        ],
      },
    },
  },
];
