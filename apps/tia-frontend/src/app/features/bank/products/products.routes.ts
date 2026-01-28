import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { accountsReducer } from '../../../store/products/accounts/accounts.reducer';
import { AccountsEffects } from '../../../store/products/accounts/accounts.effects';

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
          import('./components/accounts/accounts').then((c) => c.Accounts),
        providers: [
          provideState({ name: 'accounts', reducer: accountsReducer }),
          provideEffects(AccountsEffects),
        ],
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./components/cards/cards').then((c) => c.Cards),
      },
    ],
  },
];
