import { createFeature, createReducer, on } from '@ngrx/store';
import { LoansCreateActions } from './loans.actions';
import { initialState } from './loans.state';

export const loansFeature = createFeature({
  name: 'loanCreate',
  reducer: createReducer(
    initialState,

    on(LoansCreateActions.requestLoan, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(LoansCreateActions.requestLoanSuccess, (state, { loan }) => ({
      ...state,
      loading: false,
      loans: [],
    })),

    on(LoansCreateActions.requestLoanFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});

export const {
  name: loansFeatureKey,
  reducer: loansReducer,
  selectLoans,
  selectLoading,
  selectError,
} = loansFeature;
