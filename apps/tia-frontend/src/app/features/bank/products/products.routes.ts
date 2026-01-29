import { Routes } from '@angular/router';
import { AccountUtils } from './components/accounts/utils/account.utils';
import { FormatUtils } from './components/accounts/utils/format-date.utils';

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
        providers: [
          AccountUtils,
          FormatUtils,
        ],
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('./components/cards/cards.routes').then((r) => r.cardsRoutes),
      },
    ],
  },
];
