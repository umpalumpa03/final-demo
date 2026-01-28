import { createSelector } from '@ngrx/store';
import { accountsFeature } from './accounts.reducer';
import { AccountType } from '../../../features/bank/products/models/accounts.model';

export const {
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectError,
  selectIsCreating,
  selectCreateError,
  selectIsCreateModalOpen,
} = accountsFeature;

export const selectCurrentAccounts = createSelector(
  selectAccounts,
  (accounts) =>
    (accounts ?? []).filter((account) => account.type === AccountType.current),
);

export const selectSavingAccounts = createSelector(selectAccounts, (accounts) =>
  (accounts ?? []).filter((account) => account.type === AccountType.saving),
);

export const selectCardAccounts = createSelector(selectAccounts, (accounts) =>
  (accounts ?? []).filter((account) => account.type === AccountType.card),
);

export const selectSelectedAccount = createSelector(
  selectAccounts,
  selectSelectedAccountId,
  (accounts, selectedId) =>
    selectedId
      ? (accounts ?? []).find((account) => account.id === selectedId)
      : null,
);

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
