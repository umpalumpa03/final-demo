import { createReducer, on } from '@ngrx/store';
import { LoansState } from '../shared/models/loan.model';
import { LoansActions } from './loans.actions';
import { toTitleCase } from '../shared/utils/titlecase.util';

const initialState: LoansState = {
  loans: [],
  loading: false,
  error: null,
  filterStatus: null,
};

export const loansReducer = createReducer(
  initialState,

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
);
