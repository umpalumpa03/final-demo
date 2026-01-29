import { ILoansState } from '../shared/models/loan.model';

export const loansInitialState: ILoansState = {
  loans: [],
  months: [],
  purposes: [],
  prepaymentOptions: [],
  loading: false,
  error: null,
  filterStatus: null,
};
