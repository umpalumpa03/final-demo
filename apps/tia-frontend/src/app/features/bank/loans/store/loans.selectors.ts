import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ILoansState } from '../shared/models/loan.model';

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

export const selectFilteredLoans = (status: number | null) =>
  createSelector(selectAllLoans, (loans) => {
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
    state.prepaymentOptions.map((opt) => ({
      label: opt.prepaymentDisplayName,
      value: opt.prepaymentValue,
    })),
);
