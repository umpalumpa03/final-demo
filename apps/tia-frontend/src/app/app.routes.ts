import { Route } from '@angular/router';
import { AppB } from './app-b';

export const appRoutes: Route[] = [
  {
    path: 'library',
    loadComponent: () => import('./features/admin/components/library/container/library-container').then(m => m.LibraryContainer),
  }
];
