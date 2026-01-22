import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/library-container').then((m) => m.LibraryContainer),
    children: [
      {
        path: '',
        redirectTo: 'colorpalettes',
        pathMatch: 'full',
      },
      {
        path: 'colorpalettes',
        loadComponent: () =>
          import('./components/colorpalettes/colorpalettes').then(
            (m) => m.Colorpalettes,
          ),
      },
      {
        path: 'navigation',
        loadChildren: () =>
          import('./components/navigation/navigation-tabs.routes').then(
            (c) => c.navRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: 'colorpalettes',
      },
    ],
  },
];
