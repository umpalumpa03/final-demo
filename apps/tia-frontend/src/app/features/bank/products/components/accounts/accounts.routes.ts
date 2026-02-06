import { Route } from '@angular/router';
import { AccountUtils } from './utils/account.utils';
import { FormatUtils } from './utils/format-date.utils';
import { AccountsApiService } from '../../../../../shared/services/accounts/accounts.api.service';

export const accountsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./container/accounts').then((c) => c.Accounts),
    providers: [AccountsApiService, AccountUtils, FormatUtils],
  },
  {
    path: 'create',
    loadComponent: () => import('./container/accounts').then((c) => c.Accounts),
    providers: [AccountsApiService, AccountUtils, FormatUtils],
  },
];
