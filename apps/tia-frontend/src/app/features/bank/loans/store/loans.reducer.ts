import { createReducer, on } from '@ngrx/store';
import { ILoan } from '../shared/models/loan.model';
import { LoansActions } from './loans.actions';

export interface LoansState {
  loans: ILoan[];
  loading: boolean;
  error: string | null;
  filterStatus: number | null;
}

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
    loans,
    loading: false,
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
);
