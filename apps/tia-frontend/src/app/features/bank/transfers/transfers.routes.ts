import { Routes } from '@angular/router';
import { TransferStore } from './store/transfers.store';
import { recipientVerifiedGuard } from './components/transfers-external/guards/recipient-verified.guard';
import { accountsSelectedGuard } from './components/transfers-external/guards/accounts-selected.guard';
import { TransferInternalService } from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/services/transfer.internal.service';
import { TransferRecipientService } from './components/transfers-external/services/transfer-recipient.service';
import { TransferAccountSelectionService } from './components/transfers-external/services/transfer-account-selection.service';
import { TransferAmountService } from './components/transfers-external/services/transfer-amount.service';
import { TransferExecutionService } from './components/transfers-external/services/transfer-execution.service';
import { internalAccountsSelectedGuard } from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/guards/accounts-selected.guard';
import { TransferRepeatService } from './services/transfer-repeat.service';
import {
  fromAccountSelectedGuard
} from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/guards/from-account-selected.guard';
export const transfersRoutes: Routes = [
  {
    path: '',
    providers: [
      TransferStore,
      TransferRecipientService,
      TransferAccountSelectionService,
      TransferAmountService,
      TransferExecutionService,
      TransferRepeatService,
    ],
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
        providers: [TransferInternalService],
        loadComponent: () =>
          import(
            './components/transfers-internal/container/transfers-internal'
          ).then((c) => c.TransfersInternal),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'from-account',
          },
          {
            path: 'from-account',
            loadComponent: () =>
              import(
                './components/transfers-internal/components/internal-from-account/internal-from-account'
              ).then((c) => c.InternalFromAccount),
          },
          {
            path: 'to-account',
            loadComponent: () =>
              import(
                './components/transfers-internal/components/internal-to-account/internal-to-account'
              ).then((c) => c.InternalToAccount),
            canActivate: [fromAccountSelectedGuard],
          },
          {
            path: 'amount',
            loadComponent: () =>
              import(
                './components/transfers-internal/components/internal-amount/internal-amount'
              ).then((c) => c.InternalAmount),
            canActivate: [internalAccountsSelectedGuard],
          },
        ],
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
            canActivate: [recipientVerifiedGuard],
          },
          {
            path: 'amount',
            loadComponent: () =>
              import(
                './components/transfers-external/components/external-amount/external-amount'
              ).then((c) => c.ExternalAmount),
            canActivate: [recipientVerifiedGuard, accountsSelectedGuard],
          },
        ],
      },
    ],
  },
];
