import { IAccounts } from '../models/account.models';

export interface IAccountsState {
  accounts: IAccounts[] | null;
  loading: boolean;
  loaded: boolean;
  visibilityLoadingIds: Set<string>;
  favoriteLoadingIds: Set<string>;
  changeNameLoadingIds: Set<string>;
  error: string | null;
  successMessage: string | null;
}

export const initialState: IAccountsState = {
  accounts: null,
  loading: false,
  loaded: false,
  visibilityLoadingIds: new Set(),
  favoriteLoadingIds: new Set(),
  changeNameLoadingIds: new Set(),
  error: null,
  successMessage: null,
};
