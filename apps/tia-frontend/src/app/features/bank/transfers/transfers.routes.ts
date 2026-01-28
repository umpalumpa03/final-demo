import { Routes } from '@angular/router';

export const transfersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/transfers-container').then(
        (c) => c.TransfersContainer,
      ),
    children: [
      {
        path: '',
        redirectTo: 'internal',
        pathMatch: 'full',
      },
      {
        path: 'internal',
        loadComponent: () =>
          import('./components/transfers-internal/transfers-internal').then(
            (c) => c.TransfersInternal,
          ),
      },
      {
        path: 'external',
        loadComponent: () =>
          import('./components/transfers-external/transfers-external').then(
            (c) => c.TransfersExternal,
          ),
      },
    ],
  },
];
