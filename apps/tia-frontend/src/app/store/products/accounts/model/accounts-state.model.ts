import { Account } from '../../../../shared/models/accounts/accounts.model';

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
};
