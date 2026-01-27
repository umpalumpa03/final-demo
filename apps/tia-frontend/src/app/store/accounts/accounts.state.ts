import { Account } from '../../features/bank/products/models/account.model';

export interface AccountsState {
  accounts: Account[];
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isAuthenticated: boolean;
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,
  isCreateModalOpen: false,
  isAuthenticated: true,
};
