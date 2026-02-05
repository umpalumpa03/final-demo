import { IAccounts } from '../models/account.models';

export interface IAccountsState {
  accounts: IAccounts[] | null;
  loading: boolean;
  error: string | null;
}

export const initialState: IAccountsState = {
  accounts: null,
  loading: false,
  error: null,
};
