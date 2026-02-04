import { LoanManagementState } from '../shared/models/loan-management.model';

/**
 * Initial state for loan management store
 */
export const loanManagementInitialState: LoanManagementState = {
  // List state
  pendingApprovals: [],
  loading: false,
  error: null,

  // Selection state
  selectedLoanId: null,

  // Cache for user info (keyed by userId)
  userInfoCache: {},

  // Loading states
  userInfoLoading: false,

  // Action state (approve/reject)
  actionLoading: false,
  actionError: null,
};
