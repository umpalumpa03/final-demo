
import { Routes } from '@angular/router';

export const accountsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/account-container').then((c) => c.AccountContainer),
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