import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./container/library-container').then(m => m.LibraryContainer),
    children: [
      {
        path: 'components/colorpalettes',
        loadComponent: () => import('./components/colorpalettes/colorpalettes').then(m => m.Colorpalettes),
      },
    ],
  },
];
