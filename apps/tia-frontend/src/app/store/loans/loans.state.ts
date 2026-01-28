import { ILoan } from '../../features/bank/loans/shared/models/loan.model';

export interface LoansState {
  loans: ILoan[];
  loading: boolean;
  error: string | null;
}

export const initialState: LoansState = {
  loans: [],
  loading: false,
  error: null,
};
