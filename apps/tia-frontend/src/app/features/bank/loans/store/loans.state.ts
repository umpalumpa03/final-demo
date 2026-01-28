import { ILoansState } from '../shared/models/loan.model';

export const initialState: ILoansState = {
  loans: [],
  months: [],
  purposes: [],
  loading: false,
  error: null,
  filterStatus: null,
};
