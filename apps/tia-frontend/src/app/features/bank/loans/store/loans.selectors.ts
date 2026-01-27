import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoansState } from './loans.reducer';

export const selectLoansState = createFeatureSelector<LoansState>('loans');

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
