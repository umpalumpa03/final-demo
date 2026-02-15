import { Account } from '../../../../shared/models/accounts/accounts.model';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

export interface AccountNotification {
  id?: string;
  notificationType: 'success' | 'error' | 'info';
  message: string;
}

export interface AccountsState {
  accounts: Account[];
  selectedAccountId: Account | null;
  currencies: string[];
  isLoadingCurrencies: boolean;
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
  notifications: AccountNotification[];
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  selectedAccountId: null,
  currencies: [],
  isLoadingCurrencies: false,
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
  notifications: [],
};
