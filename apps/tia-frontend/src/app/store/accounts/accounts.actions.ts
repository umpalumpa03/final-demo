import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Account } from '../../features/bank/products/models/account.model';

export const AccountsActions = createActionGroup({
  source: 'Accounts',
  events: {
    'Load Accounts': emptyProps(),
    'Load Accounts Success': props<{ accounts: Account[] }>(),
    'Load Accounts Failure': props<{ error: string }>(),

    'Select Account': props<{ accountId: string | null }>(),
  },
});
