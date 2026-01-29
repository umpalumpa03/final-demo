import { Account } from '../../../shared/models/accounts/accounts.model';

export interface AccountsState {
  accounts: Account[];
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  isCreateModalOpen: boolean;
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
  isCreateModalOpen: false,
};
