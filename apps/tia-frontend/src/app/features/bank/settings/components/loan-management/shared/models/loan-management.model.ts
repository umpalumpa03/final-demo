/**
 * Loan approval status constants for POST /loans/approve
 */
export const LOAN_APPROVAL_STATUS = {
  APPROVED: 1,
  REJECTED: 2,
} as const;

export type LoanApprovalStatusType =
  (typeof LOAN_APPROVAL_STATUS)[keyof typeof LOAN_APPROVAL_STATUS];

/**
 * Credit score badge from API
 */
export type CreditScoreBadge = 'Poor' | 'Fair' | 'Good' | 'Excellent';

/**
 * Address object from loan details
 */
export interface LoanAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}

/**
 * Contact person from loan details
 */
export interface ContactPerson {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

/**
 * Pending approval item from GET /loans/pending-approvals
 */
export interface PendingApproval {
  id: string;
  userId: string;
  userFullName: string;
  loanAmount: number;
  accountId: string;
  months: number;
  purpose: string;
  status: number;
  statusName: string;
  address: LoanAddress;
  contactPerson: ContactPerson;
  createdAt: string;
}

/**
 * User/Applicant info from GET /loans/user-info/{userId}
 * Fetched ONLY on demand when loan case is opened
 */
export interface UserInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  employmentStatus: string;
  address: string;
  annualIncome: number;
  creditScore: number;
  creditScoreBadge: CreditScoreBadge;
}

/**
 * Request body for POST /loans/approve
 */
export interface ApproveLoanRequest {
  loanId: string;
  status: LoanApprovalStatusType;
  rejectionReason?: string;
}

/**
 * Response from POST /loans/approve
 */
export interface ApproveLoanResponse {
  id: string;
  status: number;
  statusName: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Signal Store state for loan management
 */
export interface LoanManagementState {
  // List state
  pendingApprovals: PendingApproval[];
  loading: boolean;
  error: string | null;

  // Selection state
  selectedLoanId: string | null;

  // Cache for user info (keyed by userId)
  userInfoCache: Record<string, UserInfo>;

  // Loading states
  userInfoLoading: boolean;

  // Action state (approve/reject)
  actionLoading: boolean;
  actionError: string | null;
}
