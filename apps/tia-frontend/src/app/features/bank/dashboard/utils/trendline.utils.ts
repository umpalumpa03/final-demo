import { Account } from '../../../../shared/models/accounts/accounts.model';
import { ITransactions } from '../../../../shared/models/transactions/transactions.models';
import { TrendlineInfo, AccountWithTrendline } from '../models/account-trendline.models';

/**
 * Calculate trendline information for an account based on its last transaction
 * Only shows trendline for transactions within the last 24 hours
 */
export function calculateTrendline(
  account: Account,
  transaction: ITransactions | null,
): TrendlineInfo | null {
  if (!transaction) {
    return null;
  }

  // Only show trendline for transactions in the last 24 hours
  const TRENDLINE_TIMEFRAME_HOURS = 24;
  const transactionDate = new Date(transaction.createdAt);
  const now = new Date();
  const hoursSinceTransaction = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);

  // If transaction is older than 24 hours, don't show trendline
  if (hoursSinceTransaction > TRENDLINE_TIMEFRAME_HOURS) {
    return null;
  }

  // Determine if money came INTO this account (credit) or went OUT (debit)
  const isCredit = transaction.creditAccountNumber === account.iban;

  return {
    direction: isCredit ? 'up' : 'down',
    amount: transaction.amount,
    type: transaction.transactionType,
  };
}

/**
 * Sort accounts to prioritize those with recent activity (trendlines)
 */
export function sortAccountsByRecentActivity(
  accounts: AccountWithTrendline[],
): AccountWithTrendline[] {
  return [...accounts].sort((a, b) => {
    // Accounts with trendline come first
    if (a.trendline && !b.trendline) return -1;
    if (!a.trendline && b.trendline) return 1;

    // Both have trendlines, sort by transaction date (most recent first)
    if (a.lastTransaction && b.lastTransaction) {
      const dateA = new Date(a.lastTransaction.createdAt).getTime();
      const dateB = new Date(b.lastTransaction.createdAt).getTime();
      return dateB - dateA;
    }

    return 0;
  });
}


