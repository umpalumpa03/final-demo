import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { loansReducer } from './store/loans.reducer';
import { LoansEffects } from './store/loans.effects';
import { LoansContainer } from './container/loans-container';
import { LoansService } from './shared/services/loans.service';

export const loansRoutes: Routes = [
  {
    path: '',
    component: LoansContainer,
    providers: [
      provideState('loans', loansReducer),
      provideEffects(LoansEffects),
      LoansService,
    ],
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
