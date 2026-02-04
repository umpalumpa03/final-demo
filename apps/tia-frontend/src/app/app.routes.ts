import { Routes } from '@angular/router';
import { authRoutes } from './core/auth/auth.routes';
import { bankRoutes } from './layout/bank.routes';
import { storybookRoutes } from './features/storybook/storybook.routes';
import { AuthGuard } from './core/auth/guards/auth-guard';

export const appRoutes: Routes = [
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
