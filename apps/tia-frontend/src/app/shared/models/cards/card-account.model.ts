export interface CardAccount {
  id: string;
  iban: string;
  name: string;
  balance: number;
  currency: string;
  status: string;
  cardIds: string[];
  openedAt: string | null;
}

export type CardAccountsResponse = CardAccount[];