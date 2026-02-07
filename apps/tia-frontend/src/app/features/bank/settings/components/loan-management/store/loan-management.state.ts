import { LoanManagementState } from '../shared/models/loan-management.model';

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
};
