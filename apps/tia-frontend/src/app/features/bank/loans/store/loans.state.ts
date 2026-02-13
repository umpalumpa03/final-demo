import { ILoansState } from '../shared/models/loan.model';

export const loansInitialState: ILoansState = {
  loans: [],
  months: [],
  purposes: [],
  filterAccountId: null,
  accounts: [],
  prepaymentOptions: [],
  loanDetailsCache: {},
  isDetailsOpen: false,
  isPrepaymentOpen: false,
  activePrepaymentLoan: null,
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
  hasLoadedAll: false,
  loadedSubsetStatus: null,
  dashboardCounts: { all: 0, approved: 0, pending: 0, declined: 0 },
};

export enum ErrorKeys {
  REQUEST_LOAN = 'loans.store-errors.request_loan',
  LOAD_LOANS = 'loans.store-errors.load_loans',
  LOAD_DETAILS = 'store-errors.load_details',
  RENAME = 'loans.store-errors.rename',
  MONTHS = 'loans.store-errors.months',
  PURPOSES = 'loans.store-errors.purposes',
  OPTIONS = 'loans.store-errors.options',
  CALCULATION = 'loans.store-errors.calculation',
  INITIATE_PREPAYMENT = 'loans.store-errors.initiate_prepayment',
  VERIFY_PREPAYMENT = 'loans.store-errors.verify_prepayment',
  INSUFFICIENT_FUNDS = 'loans.store-errors.insufficient_funds',
  INVALID_CODE = 'loans.store-errors.invalid_code',
  PAYMENT_COMPLETE = 'loans.store-success.payment_complete',
}

export enum SuccessKeys {
  OTP_SENT = 'loans.store-success.otp_sent',
  REQUEST = 'loans.store-success.request',
}
