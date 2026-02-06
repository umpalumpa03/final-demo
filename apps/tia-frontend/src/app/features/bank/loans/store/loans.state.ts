import { ILoansState } from '../shared/models/loan.model';

export const loansInitialState: ILoansState = {
  loans: [],
  months: [],
  purposes: [],
  accounts: [],
  prepaymentOptions: [],
  loanDetailsCache: {},
  searchQuery: '',
  selectedLoanDetails: null,
  detailsLoading: false,
  loading: false,
  error: null,
  filterStatus: null,
  calculationResult: null,
  activeChallengeId: null,
  actionLoading: false,
  alertMessage: null,
  alertType: null,
  dashboardCounts: { all: 0, approved: 0, pending: 0, declined: 0 },
};
