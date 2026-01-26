import { Routes } from '@angular/router';

export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('./container/bank-container').then((c) => c.BankContainer),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/container/dashboard-container').then(
            (c) => c.DashboardContainer,
          ),
      },
 
      {
  path: 'accounts',
  loadChildren: () =>
    import('./components/accounts/accounts.route').then(
      (c) => c.accountsRoutes
    ),
},
      {
        path: 'transactions',
        loadComponent: () =>
          import(
            './components/transactions/container/transactions-container'
          ).then((c) => c.TransactionsContainer),
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./components/transfers/container/transfers-container').then(
            (c) => c.TransfersContainer,
          ),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./components/loans/container/loans-container').then(
            (c) => c.LoansContainer,
          ),
      },
      {
        path: 'finances',
        loadComponent: () =>
          import('./components/finances/container/finances-container').then(
            (c) => c.FinancesContainer,
          ),
      },
      {
        path: 'paybill',
        loadComponent: () =>
          import('./components/paybill/container/paybill-container').then(
            (c) => c.PaybillContainer,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/container/settings-container').then(
            (c) => c.SettingsContainer,
          ),
      },
      {
        path: 'messaging',
        loadComponent: () =>
          import('./components/messaging/container/messaging-container').then(
            (c) => c.MessagingContainer,
          ),
      },
    ],
  },
];
