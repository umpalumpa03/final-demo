import { createSelector } from '@ngrx/store';
import { accountsFeature } from './accounts.reducer';
import { AccountType, Account } from '../../../shared/models/accounts/accounts.model';
import { ITransactions } from '../../../shared/models/transactions/transactions.models';

export const {
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectIsFetching,
  selectError,
  selectIsCreating,
  selectCreateError,
  selectIsCreateModalOpen,
  selectIsUpdatingFriendlyName,
  selectUpdateFriendlyNameError,
  selectLastTransactions,
  selectIsLoadingLastTransactions,
  selectLastTransactionsError,
} = accountsFeature;

export const selectCurrentAccounts = createSelector(
  selectAccounts,
  (accounts) =>
    (accounts ?? [])
      .filter(
        (account) => account.type === AccountType.current && !account.isHidden,
      )
      .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)),
);

export const selectSavingAccounts = createSelector(selectAccounts, (accounts) =>
  (accounts ?? [])
    .filter(
      (account) => account.type === AccountType.saving && !account.isHidden,
    )
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)),
);

export const selectCardAccounts = createSelector(selectAccounts, (accounts) =>
  (accounts ?? [])
    .filter((account) => account.type === AccountType.card && !account.isHidden)
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)),
);

export const selectSelectedAccount = selectSelectedAccountId;

export const selectAccountsGrouped = createSelector(
  selectCurrentAccounts,
  selectSavingAccounts,
  selectCardAccounts,
  (current, saving, card) => ({
    current,
    saving,
    card,
  }),
);

export const selectAccountOptions = createSelector(selectAccounts, (accounts) =>
  (accounts ?? []).map((acc) => ({
    label: `${acc.friendlyName || acc.name} (${acc.currency}) - ${acc.balance} ${acc.currency}`,
    value: acc.id,
  })),
);

export const selectGelAccountOptions = createSelector(
  selectAccounts,
  (accounts) =>
    (accounts ?? [])
      .filter((acc) => acc.currency === 'GEL')
      .map((acc) => ({
        label: `${acc.friendlyName || acc.name} (${acc.currency}) - ${acc.balance} ${acc.currency}`,
        value: acc.id,
        isFavorite: acc.isFavorite,
      })),
);

// Trendline feature types
export interface TrendlineInfo {
  direction: 'up' | 'down';
  amount: number;
  type: 'credit' | 'debit';
}

export interface AccountWithTrendline extends Account {
  lastTransaction: ITransactions | null;
  trendline: TrendlineInfo | null;
}

// Helper function to calculate trendline from transaction
function calculateTrendline(
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

// Main selector: Combine accounts with their last transactions and trendline info
export const selectAccountsWithTrendline = createSelector(
  selectAccounts,
  selectLastTransactions,
  (accounts, lastTransactions): AccountWithTrendline[] => {
    const enrichedAccounts = accounts.map((account) => {
      const lastTransaction = lastTransactions[account.iban] || null;
      const trendline = calculateTrendline(account, lastTransaction);

      return {
        ...account,
        lastTransaction,
        trendline,
      };
    });

    // Sort: accounts with recent transactions (trendlines) first
    return enrichedAccounts.sort((a, b) => {
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
  },
);

