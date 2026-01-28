import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { paybillReducer } from '../features/bank/paybill/store/paybill.reducer';
import { provideEffects } from '@ngrx/effects';
import * as paybillEffects from '../features/bank/paybill/store/paybill.effects';
import * as transactionEffects from '../store/transactions/transactions.effects';
import {
  TRANSACTION_FEATURE_KEY,
  transactionReducer,
} from '../store/transactions/transactions.reducer';
import { TransactionService } from '../features/bank/transactions/services/transactions-service/transaction-service';
export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('./bank-container').then((c) => c.BankContainer),
    providers: [{ provide: TransactionService }],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            '../features/bank/dashboard/container/dashboard-container'
          ).then((c) => c.DashboardContainer),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../features/bank/products/products.routes').then(
            (c) => c.productsRoutes,
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import(
            '../features/bank/transactions/container/transactions-container'
          ).then((c) => c.TransactionsContainer),
        providers: [
          provideEffects(transactionEffects),
          provideState({
            name: TRANSACTION_FEATURE_KEY,
            reducer: transactionReducer,
          }),
        ],
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import(
            '../features/bank/transfers/container/transfers-container'
          ).then((c) => c.TransfersContainer),
      },
      {
        path: 'loans',
        loadChildren: () =>
          import('../features/bank/loans/loans.routes').then(
            (c) => c.loansRoutes,
          ),
      },
      {
        path: 'my-finances',
        loadComponent: () =>
          import('../features/bank/finances/container/finances-container').then(
            (c) => c.FinancesContainer,
          ),
      },
      {
        path: 'paybill',
        loadChildren: () =>
          import('../features/bank/paybill/paybill.routes').then(
            (r) => r.PAYBILL_ROUTES,
          ),
        providers: [
          provideState({ name: 'paybill', reducer: paybillReducer }),
          provideEffects(paybillEffects),
        ],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../features/bank/settings/settings.routes').then(
            (r) => r.settingsRoutes,
          ),
      },
      {
        path: 'messaging',
        loadChildren: () =>
          import('../features/bank/messaging/messaging.routes').then(
            (r) => r.messagingRoutes,
          ),
      },
    ],
  },
];
