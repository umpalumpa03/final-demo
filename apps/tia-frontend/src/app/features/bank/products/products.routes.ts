import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { accountsReducer } from '../../../store/products/accounts/accounts.reducer';
import { AccountsEffects } from '../../../store/products/accounts/accounts.effects';
import { AccountUtils } from './components/accounts/utils/account.utils';
import { FormatUtils } from './components/accounts/utils/format-date.utils';
import { AccountsService } from '../../../shared/services/accounts/accounts.service';

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
          provideState({ name: 'accounts', reducer: accountsReducer }),
          provideEffects(AccountsEffects),
          AccountsService,
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
