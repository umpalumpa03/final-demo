import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/products-container').then((c) => c.ProductsContainer),
    children: [
      {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full',
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./components/accounts/accounts.routes').then(
            (r) => r.accountsRoutes,
          ),
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('./components/cards/cards.routes').then((r) => r.cardsRoutes),
      },
    ],
  },
];
