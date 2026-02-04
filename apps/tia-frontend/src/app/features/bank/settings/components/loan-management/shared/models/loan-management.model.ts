export const LOAN_APPROVAL_STATUS = {
  APPROVED: 1,
  REJECTED: 2,
} as const;

export type LoanApprovalStatusType =
  (typeof LOAN_APPROVAL_STATUS)[keyof typeof LOAN_APPROVAL_STATUS];
export type CreditScoreBadge = 'Poor' | 'Fair' | 'Good' | 'Excellent';

export interface LoanAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}
export interface ContactPerson {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}
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

export interface ApproveLoanRequest {
  loanId: string;
  status: LoanApprovalStatusType;
  rejectionReason?: string;
}

export interface ApproveLoanResponse {
  id: string;
  status: number;
  statusName: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface LoanManagementState {
  pendingApprovals: PendingApproval[];
  loading: boolean;
  error: string | null;
  selectedLoanId: string | null;
  userInfoCache: Record<string, UserInfo>;
  userInfoLoading: boolean;
  actionLoading: boolean;
  actionError: string | null;
}
