import { createReducer, on } from '@ngrx/store';
import { LoansActions } from './loans.actions';
import { toTitleCase } from '../shared/utils/titlecase.util';
import { loansInitialState } from './loans.state';

export const loansReducer = createReducer(
  loansInitialState,

  on(LoansActions.loadLoans, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LoansActions.loadLoansSuccess, (state, { loans }) => ({
    ...state,
    loading: false,
    loans: loans.map((l) => ({
      ...l,
      purpose: toTitleCase(l.purpose) || '',
      friendlyName: toTitleCase(l.friendlyName),
    })),
  })),

  on(LoansActions.loadLoansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LoansActions.setFilter, (state, { status }) => ({
    ...state,
    filterStatus: status,
  })),

  on(LoansActions.renameLoanSuccess, (state, { id, name }) => ({
    ...state,
    loans: state.loans.map((loan) =>
      loan.id === id ? { ...loan, friendlyName: name } : loan,
    ),
  })),

  on(LoansActions.loadMonthsSuccess, (state, { months }) => ({
    ...state,
    months,
    loading: false,
  })),

  on(LoansActions.loadPurposesSuccess, (state, { purposes }) => ({
    ...state,
    purposes: purposes,
    error: null,
  })),

  on(LoansActions.loadPurposesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(LoansActions.loadPrepaymentOptionsSuccess, (state, { options }) => ({
    ...state,
    prepaymentOptions: options,
    error: null,
  })),

  on(LoansActions.calculatePrepaymentSuccess, (state, { result }) => ({
    ...state,
    calculationResult: result,
    error: null,
  })),

  on(LoansActions.calculatePrepaymentFailure, (state, { error }) => ({
    ...state,
    calculationResult: null,
    error,
  })),

  on(LoansActions.clearCalculationResult, (state) => ({
    ...state,
    calculationResult: null,
  })),
);
