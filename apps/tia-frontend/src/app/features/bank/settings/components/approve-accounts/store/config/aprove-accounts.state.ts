import { IAccountsPermissions } from "../../../../shared/models/approve-models/accounts-models/account-permissions.models";
import { BankAccount } from '../../../../shared/models/approve-models/accounts-models/pending-accounts.models';

export interface IAccountPermissionState {
  permissions: IAccountsPermissions[];
  pendingAccounts: BankAccount[];
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialStateAccountPermissions: IAccountPermissionState = {
  permissions: [],
  pendingAccounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,
};
