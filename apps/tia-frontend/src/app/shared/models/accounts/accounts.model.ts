import { InputConfig } from '../../lib/forms/models/input.model';
import { SelectConfig } from '../../lib/forms/models/dropdowns.model';

export enum AccountType {
  current = 'current',
  saving = 'saving',
  card = 'card',
}

export interface Account {
  id: string;
  userId: string;
  permission: number;
  friendlyName: string | null;
  type: AccountType;
  currency: string;
  iban: string;
  name: string;
  status: string;
  balance: number;
  createdAt: string;
  openedAt: string;
  closedAt: string;
  isFavorite: boolean;
}

export interface CreateAccountConfig {
  friendlyName: InputConfig;
  type: SelectConfig;
  currency: SelectConfig;
}

export interface CreateAccountRequest {
  friendlyName: string;
  type: AccountType;
  currency: string;
}

export interface GroupedAccounts {
  current: Account[];
  saving: Account[];
  card: Account[];
}

export interface AccountSection {
  key: AccountType;
  title: string;
  icon: string;
}

export type AccountsResponse = Account[];
