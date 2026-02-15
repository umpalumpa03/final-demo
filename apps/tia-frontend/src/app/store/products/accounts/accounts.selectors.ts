import { createSelector } from '@ngrx/store';
import { accountsFeature } from './accounts.reducer';
import { AccountType } from '../../../shared/models/accounts/accounts.model';

export const {
  selectAccounts,
  selectSelectedAccountId,
  selectCurrencies,
  selectIsLoadingCurrencies,
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
  selectNotifications,
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
  (accounts) => {
    const CAN_PAY_BILLS = 8;

    return (accounts ?? [])
      .filter((acc) => {
        const isGel = acc.currency === 'GEL';

        const canPayBills = (acc.permission & CAN_PAY_BILLS) === CAN_PAY_BILLS;

        return isGel && canPayBills;
      })
      .map((acc) => ({
        label: `${acc.friendlyName || acc.name} (${acc.currency}) - ${acc.balance} ${acc.currency}`,
        value: acc.id,
        isFavorite: acc.isFavorite,
      }));
  },
);
