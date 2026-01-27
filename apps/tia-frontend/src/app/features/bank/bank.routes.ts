import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { paybillReducer } from './paybill/store/paybill.reducer';
import { provideEffects } from '@ngrx/effects';
import * as paybillEffects from './paybill/store/paybill.effects';
export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('../../layout/bank-container').then((c) => c.BankContainer),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/container/dashboard-container').then(
            (c) => c.DashboardContainer,
          ),
      },

      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.routes').then((c) => c.productsRoutes),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./transactions/container/transactions-container').then(
            (c) => c.TransactionsContainer,
          ),
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./transfers/container/transfers-container').then(
            (c) => c.TransfersContainer,
          ),
      },
      {
        path: 'loans',
        loadChildren: () =>
          import('./loans/loans.routes').then((c) => c.loansRoutes),
      },
      {
        path: 'finances',
        loadComponent: () =>
          import('./finances/container/finances-container').then(
            (c) => c.FinancesContainer,
          ),
      },
      {
        path: 'paybill',
        loadChildren: () =>
          import('./paybill/paybill.routes').then((r) => r.PAYBILL_ROUTES),
        providers: [
          provideState({ name: 'paybill', reducer: paybillReducer }),
          provideEffects(paybillEffects),
        ],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((r) => r.settingsRoutes),
      },
      {
        path: 'messaging',
        loadChildren: () =>
          import('./messaging/messaging.routes').then((r) => r.messagingRoutes),
      },
    ],
  },
];
