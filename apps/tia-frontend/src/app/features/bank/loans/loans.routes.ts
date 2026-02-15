import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { LoansContainer } from './container/loans-container';
import { AccountsEffects } from '../../../store/products/accounts/accounts.effects';
import { accountsFeature } from '../../../store/products/accounts/accounts.reducer';

export const loansRoutes: Routes = [
  {
    path: '',
    component: LoansContainer,
    providers: [provideState(accountsFeature), provideEffects(AccountsEffects)],
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'all',
        loadComponent: () =>
          import('./components/pages/all-loans/all-loans').then(
            (c) => c.AllLoans,
          ),
      },
      {
        path: 'approved',
        loadComponent: () =>
          import('./components/pages/approved-loans/approved-loans').then(
            (c) => c.ApprovedLoans,
          ),
      },
      {
        path: 'pending',
        loadComponent: () =>
          import('./components/pages/pending-loans/pending-loans').then(
            (c) => c.PendingLoans,
          ),
      },
      {
        path: 'declined',
        loadComponent: () =>
          import('./components/pages/declined-loans/declined-loans').then(
            (c) => c.DeclinedLoans,
          ),
      },
    ],
  },
];
