import { createSelector } from '@ngrx/store';
import { selectAccounts, selectLastTransactions } from '../../../../store/products/accounts/accounts.selectors';
import { AccountWithTrendline } from '../models/account-trendline.models';
import { calculateTrendline, sortAccountsByRecentActivity } from '../utils/trendline.utils';

export const selectDashboardAccountsWithTrendline = createSelector(
  selectAccounts,
  selectLastTransactions,
  (accounts, lastTransactions): AccountWithTrendline[] => {
    const enrichedAccounts: AccountWithTrendline[] = accounts.map((account) => {
      const lastTransaction = lastTransactions[account.iban] || null;
      const trendline = calculateTrendline(account, lastTransaction);

      return {
        ...account,
        lastTransaction,
        trendline,
      };
    });

    return sortAccountsByRecentActivity(enrichedAccounts);
  },
);


