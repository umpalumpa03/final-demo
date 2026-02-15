import { Account } from '../../../../shared/models/accounts/accounts.model';
import { ITransactions } from '../../../../shared/models/transactions/transactions.models';
import { TrendlineInfo, AccountWithTrendline } from '../models/account-trendline.models';

export function calculateTrendline(
  account: Account,
  transaction: ITransactions | null,
): TrendlineInfo | null {
  if (!transaction) {
    return null;
  }

  const TRENDLINE_TIMEFRAME_HOURS = 24;
  const transactionDate = new Date(transaction.createdAt);
  const now = new Date();
  const hoursSinceTransaction = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceTransaction > TRENDLINE_TIMEFRAME_HOURS) {
    return null;
  }

  const isCredit = transaction.creditAccountNumber === account.iban;

  return {
    direction: isCredit ? 'up' : 'down',
    amount: transaction.amount,
    type: transaction.transactionType,
  };
}

export function sortAccountsByRecentActivity(
  accounts: AccountWithTrendline[],
): AccountWithTrendline[] {
  return [...accounts].sort((a, b) => {
    if (a.trendline && !b.trendline) return -1;
    if (!a.trendline && b.trendline) return 1;

    if (a.lastTransaction && b.lastTransaction) {
      const dateA = new Date(a.lastTransaction.createdAt).getTime();
      const dateB = new Date(b.lastTransaction.createdAt).getTime();
      return dateB - dateA;
    }

    return 0;
  });
}


