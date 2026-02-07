import { IAccountsPermissions } from '../../models/account-permissions.models';

export interface IAccountPermissionState {
  permissions: IAccountsPermissions[];
  isLoading: boolean;
  error: string | null;
}

export const initialStateAccountPermissions: IAccountPermissionState = {
  permissions: [],
  isLoading: false,
  error: null,
};
