import { createSelector } from '@ngrx/store';
import { accountsFeature } from './accounts.reducer';
import { AccountType } from '../../../shared/models/accounts/accounts.model';

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
