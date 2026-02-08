import { CardPermission } from "../../approve-cards/shared/model/approve-cards.model";

export interface IAccountsPermissions {
  value: number | CardPermission;
  label: string;
}

export interface IUpdateAccountPermission {
  accountId: string;
  permissions: number;
}
