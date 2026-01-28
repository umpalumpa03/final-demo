export enum AccountType {
  current = 'current',
  saving = 'saving',
  card = 'card',
}
export interface Account {
  id: string;
  userId: string;
  permission: number;
  type: AccountType;
  currency: string;
  iban: string;
  name: string;
  friendlyName: string;
  status: string;
  balance: number;
  createdAt: string;
  openedAt: string;
  closedAt: string;
  isFavorite: boolean;
}

export interface CreateAccountRequest {
  friendlyName: string;
  type: AccountType;
  currency: string;
}

// TODO: if more than 1 response, move to different file
export type AccountsResponse = Account[];
