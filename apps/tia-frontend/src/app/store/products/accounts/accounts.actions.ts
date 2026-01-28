import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Account,
  CreateAccountRequest,
} from '../../../features/bank/products/models/accounts.model';

export const AccountsActions = createActionGroup({
  source: 'Accounts',
  events: {
    'Load Accounts': emptyProps(),
    'Load Accounts Success': props<{ accounts: Account[] }>(),
    'Load Accounts Failure': props<{ error: string }>(),

    'Select Account': props<{ accountId: string | null }>(),

    'Create Account': props<{ request: CreateAccountRequest }>(),
    'Create Account Success': props<{ account: Account }>(),
    'Create Account Failure': props<{ error: string }>(),

    'Open Create Modal': emptyProps(),
    'Close Create Modal': emptyProps(),
  },
});
