import { createSelector } from '@ngrx/store';
import { productsFeature } from './products.reducer';
import { AccountType } from '../../features/bank/products/models/account-type.enum';

export const {
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectError,
  selectIsCreateModalOpen,
} = productsFeature;

export const selectCurrentAccounts = createSelector(
  selectAccounts,
  (accounts) =>
    accounts.filter((account) => account.type === AccountType.current),
);

export const selectSavingAccounts = createSelector(selectAccounts, (accounts) =>
  accounts.filter((account) => account.type === AccountType.saving),
);

export const selectCardAccounts = createSelector(selectAccounts, (accounts) =>
  accounts.filter((account) => account.type === AccountType.card),
);

export const selectSelectedAccount = createSelector(
  selectAccounts,
  selectSelectedAccountId,
  (accounts, selectedId) =>
    selectedId ? accounts.find((account) => account.id === selectedId) : null,
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
