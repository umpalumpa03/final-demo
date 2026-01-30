import { ILoansState } from '../shared/models/loan.model';

export const loansInitialState: ILoansState = {
  loans: [],
  months: [],
  purposes: [],
  accounts: [],
  prepaymentOptions: [],
  loading: false,
  error: null,
  filterStatus: null,
  calculationResult: null,
  activeChallengeId: null,
  actionLoading: false,
};
