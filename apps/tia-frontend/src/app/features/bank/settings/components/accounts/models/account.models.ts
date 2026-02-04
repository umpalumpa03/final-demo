export interface IAccounts {
  id: string;
  type: string;
  currency: string;
  iban: string;
  name: string;
  friendlyName: string;
  isHidden: boolean;
  order: number;
  isFavorite: boolean;
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
