import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Account,
  CreateAccountRequest,
} from '../../../shared/models/accounts/accounts.model';

export const AccountsActions = createActionGroup({
  source: 'Accounts',
  events: {
    'Load Accounts': emptyProps(),
    'Load Accounts Success': props<{ accounts: Account[] }>(),
    'Load Accounts Failure': props<{ error: string }>(),

    'Fetch More Accounts': emptyProps(),
    'Fetch More Accounts Success': props<{ accounts: Account[] }>(),
    'Fetch More Accounts Failure': props<{ error: string }>(),

    'Select Account': props<{ accountId: string | null }>(),

    'Create Account': props<{ request: CreateAccountRequest }>(),
    'Create Account Success': props<{ account: Account }>(),
    'Create Account Failure': props<{ error: string }>(),

    'Update Friendly Name': props<{
      accountId: string;
      friendlyName: string;
    }>(),
    'Update Friendly Name Success': props<{ account: Account }>(),
    'Update Friendly Name Failure': props<{ error: string }>(),

    'Open Create Modal': emptyProps(),
    'Close Create Modal': emptyProps(),
  },
});
