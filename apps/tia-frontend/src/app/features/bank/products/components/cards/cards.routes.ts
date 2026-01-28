import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { cardsReducer } from '../../../../../store/products/cards/cards.reducer';
import { CardsEffects } from '../../../../../store/products/cards/cards.effects';

export const cardsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./container/cards').then((c) => c.Cards),
    providers: [
      provideState({ name: 'cards', reducer: cardsReducer }),
      provideEffects(CardsEffects),
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./components/card-list/container/card-list').then(
            (c) => c.CardList,
          ),
      },
      {
        path: 'account/:accountId',
        loadComponent: () =>
          import(
            './components/account-cards/container/account-cards'
          ).then((c) => c.AccountCards),
      },
      {
        path: 'details/:cardId',
        loadComponent: () =>
          import(
            './components/card-details/container/card-details'
          ).then((c) => c.CardDetails),
      },
      {
        path: 'transactions/:cardId',
        loadComponent: () =>
          import(
            './components/card-transactions/container/card-transactions'
          ).then((c) => c.CardTransactions),
      },
    ],
  },
];