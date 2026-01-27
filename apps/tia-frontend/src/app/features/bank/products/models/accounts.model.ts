export enum AccountType {
  current = 'current',
  saving = 'saving',
  card = 'card',
}
export interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  type: AccountType;
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAccountRequest {
  accountName: string;
  type: AccountType;
  currency: string;
}

export type AccountsResponse = Account[];
