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
        loadComponent: () =>
          import('./components/accounts/container/accounts').then(
            (c) => c.Accounts,
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
