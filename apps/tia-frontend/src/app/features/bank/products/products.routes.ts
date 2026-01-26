import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/products-container').then((c) => c.ProductsContainer),
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full'
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./components/accounts/account').then(
            (c) => c.Account
          )
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./components/cards/cards').then(
            (c) => c.Cards
          )
      }
    ]
  }
];
