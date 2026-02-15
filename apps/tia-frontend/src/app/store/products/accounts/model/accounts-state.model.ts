import { Account } from '../../../../shared/models/accounts/accounts.model';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

export interface AccountsState {
  accounts: Account[];
  selectedAccountId: Account | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  isCreateModalOpen: boolean;
  isUpdatingFriendlyName: boolean;
  updateFriendlyNameError: string | null;
  lastTransactions: Record<string, ITransactions | null>;
  isLoadingLastTransactions: boolean;
  lastTransactionsError: string | null;
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  isFetching: false,
  error: null,
  isCreating: false,
  createError: null,
  isCreateModalOpen: false,
  isUpdatingFriendlyName: false,
  updateFriendlyNameError: null,
  lastTransactions: {},
  isLoadingLastTransactions: false,
  lastTransactionsError: null,
};
