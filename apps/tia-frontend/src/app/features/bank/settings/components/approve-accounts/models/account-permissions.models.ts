export interface IAccountsPermissions {
  value: number;
  label: string;
}

export interface IUpdateAccountPermission {
  accountId: string;
  permissions: number;
}
