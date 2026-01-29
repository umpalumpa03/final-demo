import { Routes } from '@angular/router';
import { TransferStore } from './components/transfers-internal/store/transfers.store';
export const transfersRoutes: Routes = [
  {
    path: '',
    providers: [TransferStore],
    loadComponent: () =>
      import('./container/transfers-container').then(
        (c) => c.TransfersContainer,
      ),
    children: [
      {
        path: '',

        redirectTo: 'internal',
        pathMatch: 'full',
      },
      {
        path: 'internal',
        loadComponent: () =>
          import(
            './components/transfers-internal/container/transfers-internal'
          ).then((c) => c.TransfersInternal),
      },
      {
        path: 'external',
        loadComponent: () =>
          import(
            './components/transfers-external/container/transfers-external'
          ).then((c) => c.TransfersExternal),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'recipient',
          },
          {
            path: 'recipient',
            loadComponent: () =>
              import(
                './components/transfers-external/components/external-recipient/external-recipient'
              ).then((c) => c.ExternalRecipient),
          },
          {
            path: 'accounts',
            loadComponent: () =>
              import(
                './components/transfers-external/components/external-accounts/external-accounts'
              ).then((c) => c.ExternalAccounts),
          },
          {
            path: 'amount',
            loadComponent: () =>
              import(
                './components/transfers-external/components/external-amount/external-amount'
              ).then((c) => c.ExternalAmount),
          },
        ],
      },
    ],
  },
];
