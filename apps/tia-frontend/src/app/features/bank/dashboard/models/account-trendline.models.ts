import { Account } from '../../../../shared/models/accounts/accounts.model';
import { ITransactions } from '../../../../shared/models/transactions/transactions.models';

export interface TrendlineInfo {
  direction: 'up' | 'down';
  amount: number;
  type: 'credit' | 'debit';
}

export interface AccountWithTrendline extends Account {
  lastTransaction: ITransactions | null;
  trendline: TrendlineInfo | null;
}

