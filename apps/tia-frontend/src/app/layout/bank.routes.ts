import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { paybillReducer } from '../features/bank/paybill/store/paybill.reducer';
import { provideEffects } from '@ngrx/effects';
import { PaybillEffect } from '../features/bank/paybill/store/paybill.effects';
import * as transactionEffects from '../store/transactions/transactions.effects';
import {
  TRANSACTION_FEATURE_KEY,
  transactionReducer,
} from '../store/transactions/transactions.reducer';
import { FinancesStore } from '../features/bank/finances/store/finances.store';
import { FinancesService } from '../features/bank/finances/services/finances.service';
import { ExchangeRateReducer } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.reducers';
import { accountsFeature } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { ExchangeRatesEffects } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.effects';
import { AccountsEffects } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.effects';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthGuard } from '../core/auth/guards/auth-guard';
import { translationResolver } from '../core/i18n';

export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('./bank-container').then((c) => c.BankContainer),
    // canActivateChild: [AuthGuard],
    providers: [
      provideState({
        name: TRANSACTION_FEATURE_KEY,
        reducer: transactionReducer,
      }),
      provideState({ name: 'ExchangeRates', reducer: ExchangeRateReducer }),
      provideState(accountsFeature),

      provideEffects([
        ExchangeRatesEffects,
        AccountsEffects,
        transactionEffects,
      ]),
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        resolve: { translations: translationResolver('dashboard') },
        loadComponent: () =>
          import(
            '../features/bank/dashboard/container/dashboard-container'
          ).then((c) => c.DashboardContainer),
      },
      {
        path: 'products',
        resolve: { translations: translationResolver('my-products') },
        loadChildren: () =>
          import('../features/bank/products/products.routes').then(
            (c) => c.productsRoutes,
          ),
      },
      {
        path: 'transactions',
        resolve: { translations: translationResolver('transactions') },
        loadComponent: () =>
          import(
            '../features/bank/transactions/container/transactions-container'
          ).then((c) => c.TransactionsContainer),
      },
      {
        path: 'transfers',
        resolve: { translations: translationResolver('transfers') },
        loadChildren: () =>
          import('../features/bank/transfers/transfers.routes').then(
            (r) => r.transfersRoutes,
          ),
      },
      {
        path: 'loans',
        resolve: { translations: translationResolver('loans') },
        loadChildren: () =>
          import('../features/bank/loans/loans.routes').then(
            (c) => c.loansRoutes,
          ),
      },
      {
        path: 'finances',
        resolve: { translations: translationResolver('my-finances') },
        providers: [
          FinancesStore,
          FinancesService,
          provideCharts(withDefaultRegisterables()),
        ],
        loadComponent: () =>
          import('../features/bank/finances/container/finances-container').then(
            (c) => c.FinancesContainer,
          ),
      },
      {
        path: 'paybill',
        resolve: { translations: translationResolver('paybill') },
        loadChildren: () =>
          import('../features/bank/paybill/paybill.routes').then(
            (r) => r.PAYBILL_ROUTES,
          ),
        providers: [
          provideState({ name: 'paybill', reducer: paybillReducer }),
          provideEffects(PaybillEffect),
        ],
      },
      {
        path: 'settings',
        resolve: { translations: translationResolver('settings') },
        loadChildren: () =>
          import('../features/bank/settings/settings.routes').then(
            (r) => r.settingsRoutes,
          ),
      },
      {
        path: 'messaging',
        resolve: { translations: translationResolver('messaging') },
        loadChildren: () =>
          import('../features/bank/messaging/messaging.routes').then(
            (r) => r.messagingRoutes,
          ),
      },
    ],
  },
];
