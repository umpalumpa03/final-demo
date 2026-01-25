import { Routes } from '@angular/router';
import { authRoutes } from './core/auth/auth.routes';
import { bankRoutes } from './features/bank/bank.routes';
import { storybookRoutes } from './features/storybook/storybook.routes';

export const appRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'admin/library',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'admin/library',
  //   children: libraryRoutes,
  // },
  // {
  //   path: '**',
  //   loadComponent: () =>
  //     import('./features/wild-card/wild-card').then((c) => c.WildCardComponent),
  // },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  ...authRoutes,
  ...bankRoutes,
  ...storybookRoutes,
  {
    path: '**',
    loadComponent: () =>
      import('./features/wild-card/wild-card').then((c) => c.WildCardComponent),
  },
];
