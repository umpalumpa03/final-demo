import { Route } from '@angular/router';
import { FormatUtils } from './shared/utils/format-utils.utils';
import { AccountsApiService } from '../../../../../shared/services/accounts/accounts.api.service';
import { AccountUtils } from '@tia/shared/utils/accounts-icons/account.utils';

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
