import { LoanManagementState } from '../shared/models/loan-management.model';

export const LoanSuccessKeys = {
  APPROVED: 'settings.loan-management.alerts.success.loan_approved',
  REJECTED: 'settings.loan-management.alerts.success.loan_rejected',
} as const;

export const LoanErrorKeys = {
  ACCESS_DENIED: 'settings.loan-management.alerts.error.access_denied',
  LOAD_PENDING: 'settings.loan-management.alerts.error.load_pending',
  APPROVE_LOAN: 'settings.loan-management.alerts.error.approve_loan',
  REJECT_LOAN: 'settings.loan-management.alerts.error.reject_loan',
  ALREADY_PROCESSED: 'settings.loan-management.alerts.error.already_processed',
} as const;

export const LoanAlertTitleKeys = {
  SUCCESS: 'settings.loan-management.alerts.titles.success',
  ERROR: 'settings.loan-management.alerts.titles.error',
} as const;

export const loanManagementInitialState: LoanManagementState = {
  pendingApprovals: [],
  loading: false,
  error: null,
  selectedLoanId: null,
  userInfoCache: {},
  userInfoLoading: false,
  loanDetailsCache: {},
  loanDetailsLoading: false,
  actionLoading: false,
  actionError: null,
  successMessage: null,
  hasInitialLoad: false,
};
