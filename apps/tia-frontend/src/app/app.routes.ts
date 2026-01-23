import { Routes } from '@angular/router';
import { libraryRoutes } from './features/admin/components/library/library.routes';

export const appRoutes: Routes = [
  {
    path: 'admin/library',
    children: libraryRoutes,
  },
  {
    path: '**',
    loadComponent: () => import('./features/wild-card/wild-card').then(c=>c.WildCardComponent)
  },
];
