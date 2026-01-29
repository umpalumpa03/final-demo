import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ILoansState } from '../shared/models/loan.model';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';

export const selectLoansState =
  createFeatureSelector<ILoansState>('loans_local');

export const selectAllLoans = createSelector(
  selectLoansState,
  (state) => state.loans,
);

export const selectLoansLoading = createSelector(
  selectLoansState,
  (state) => state.loading,
);

export const selectLoansWithAccountInfo = createSelector(
  selectAllLoans,
  selectAccounts,
  (loans, accounts) => {
    const currentAccounts = accounts || [];

    return loans.map((loan) => {
      const matchedAccount = currentAccounts.find(
        (acc) => acc.id === loan.accountId,
      );

      const accName = matchedAccount
        ? matchedAccount.friendlyName || matchedAccount.name
        : 'Loading Account...';

      return {
        ...loan,
        accountName: accName,
      };
    });
  },
);

export const selectFilteredLoans = (status: number | null) =>
  createSelector(selectLoansWithAccountInfo, (loans) => {
    if (status === null) return loans;
    return loans.filter((l) => l.status === status);
  });

export const selectLoanCounts = createSelector(selectAllLoans, (loans) => ({
  all: loans.length,
  approved: loans.filter((l) => l.status === 2).length,
  pending: loans.filter((l) => l.status === 1).length,
  declined: loans.filter((l) => l.status === 3).length,
}));

export const selectLoanMonths = createSelector(
  selectLoansState,
  (state) => state.months,
);

export const selectLoanMonthsOptions = createSelector(
  selectLoanMonths,
  (months) =>
    (months || []).map((m) => ({
      label: `${m} Months`,
      value: m,
    })),
);

export const selectPurposeOptions = createSelector(
  selectLoansState,
  (state) => {
    return (state.purposes || []).map((purpose) => ({
      label: purpose.displayText,
      value: purpose.value,
    }));
  },
);

export const selectPrepaymentTypeOptions = createSelector(
  selectLoansState,
  (state) =>
    state.prepaymentOptions
      .filter((opt) => opt.isActive)
      .map((opt) => ({
        label: opt.prepaymentDisplayName,
        value: opt.prepaymentValue,
      })),
);

export const selectCalculationResult = createSelector(
  selectLoansState,
  (state) => state.calculationResult,
);

export const selectActiveChallengeId = createSelector(
  selectLoansState,
  (state) => state.activeChallengeId,
);

export const selectGelAccountOptions = createSelector(
  selectAccounts,
  (accounts) =>
    (accounts || [])
      .filter((acc) => acc.currency === 'GEL')
      .map((acc) => ({
        label: `${acc.friendlyName || acc.name} - ${acc.balance} ${acc.currency}`,
        value: acc.id,
      })),
);
