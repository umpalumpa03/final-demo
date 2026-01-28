import { ILoansState } from '../shared/models/loan.model';

export const initialState: ILoansState = {
  loans: [],
  months: [],
  loading: false,
  error: null,
  filterStatus: null,
};
