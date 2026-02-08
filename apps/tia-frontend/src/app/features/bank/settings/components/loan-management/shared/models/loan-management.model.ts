export const LOAN_APPROVAL_STATUS = {
  APPROVED: 2,
  REJECTED: 3,
} as const;

export const CREDIT_SCORE_BADGE = {
  POOR: 'Poor',
  FAIR: 'Fair',
  GOOD: 'Good',
  VERY_GOOD: 'Very Good',
  EXCELLENT: 'Excellent',
} as const;

export type LoanApprovalStatusType = (typeof LOAN_APPROVAL_STATUS)[keyof typeof LOAN_APPROVAL_STATUS];

export type CreditScoreBadge = (typeof CREDIT_SCORE_BADGE)[keyof typeof CREDIT_SCORE_BADGE];

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

export interface LoanDetails {
  loanAmount: number;
  loanPurpose: string;
  loanTermMonths: number;
  interestRate: number;
  monthlyPayment: number;
  requestDate: string;
}

export interface RiskAssessment {
  debtToIncomeRatio: number;
  loanToIncomeRatio: number;
  totalInterest: number;
}

export interface LoanDetailsResponse {
  loanDetails: LoanDetails;
  riskAssessment: RiskAssessment;
}

export interface LoanManagementState {
  pendingApprovals: PendingApproval[];
  loading: boolean;
  error: string | null;
  selectedLoanId: string | null;
  userInfoCache: Record<string, UserInfo>;
  userInfoLoading: boolean;
  loanDetailsCache: Record<string, LoanDetailsResponse>;
  loanDetailsLoading: boolean;
  actionLoading: boolean;
  actionError: string | null;
  successMessage: string | null;
  hasInitialLoad: boolean;
}
