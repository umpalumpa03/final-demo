import { AccountType } from '@tia/shared/models/accounts/accounts.model';

export interface IAccounts {
  id: string;
  type: AccountType;
  currency: string;
  iban: string;
  name: string;
  balance: string
  friendlyName: string;
  isHidden: boolean | null;
  order: number | null;
  isFavorite: boolean | null;
}

export interface IAccountRequestBase {
  accountId: string;
}

export interface IVisibilityRequest extends IAccountRequestBase {
  isHidden: boolean;
}

export interface IFavoriteRequest extends IAccountRequestBase {
  isFavorite: boolean;
}

export interface IFriendlyNameRequest extends IAccountRequestBase {
  friendlyName: string;
}

export interface IUpdateResponses {
  success: string;
}
