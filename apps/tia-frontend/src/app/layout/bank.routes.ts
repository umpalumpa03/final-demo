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
import { FinancesStore } from '../features/bank/finances/store/finances.store';
import { FinancesService } from '../features/bank/finances/services/finances.service';
import { LoanCreateService } from '@tia/shared/services/loans/loan-create.service';
import { LoanCreateEffects } from '../store/loans/loans.effects';
import { loansFeature } from '../store/loans/loans.reducer';
export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('./bank-container').then((c) => c.BankContainer),
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
        loadChildren: () =>
          import('../features/bank/transfers/transfers.routes').then(
            (r) => r.transfersRoutes,
          ),
      },
      {
        path: 'loans',
        providers: [
          provideState(loansFeature),
          provideEffects(LoanCreateEffects),
        ],
        loadChildren: () =>
          import('../features/bank/loans/loans.routes').then(
            (c) => c.loansRoutes,
          ),
      },
      {
        path: 'finances',
        providers: [FinancesStore, FinancesService],
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
