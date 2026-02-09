import { CardPermission } from "../cards-models/approve-cards.model";

export interface IAccountsPermissions {
  value: number | CardPermission;
  label: string;
}

export interface IUpdateAccountPermission {
  accountId: string;
  permissions: number;
}
