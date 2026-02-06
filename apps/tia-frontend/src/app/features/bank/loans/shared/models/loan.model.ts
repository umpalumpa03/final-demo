import { Account } from '@tia/shared/models/accounts/accounts.model';
import { LOAN_ICONS } from '../config/loan-icons.config';
import { LoanPurpose } from './loan-request.model';
import { IPrepaymentCalcResponse, PrepaymentOption } from './prepayment.model';
import { SimpleAlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';

export interface ILoan {
  id: string;
  loanAmount: number;
  accountId: string;
  accountName?: string;
  months: number;
  purpose: string;
  status: number;
  statusName: string;
  monthlyPayment: number;
  nextPaymentDate: string | null;
  createdAt: string;
  friendlyName: string | null;
}

export interface ILoansState {
  loans: ILoan[];
  selectedLoanDetails: ILoanDetails | null;
  detailsLoading: boolean;
  months: number[];
  purposes: LoanPurpose[];
  accounts: Account[];
  prepaymentOptions: PrepaymentOption[];
  loanDetailsCache: Record<string, ILoanDetails>;
  loading: boolean;
  error: string | null;
  filterStatus: number | null;
  calculationResult: IPrepaymentCalcResponse | null;
  activeChallengeId: string | null;
  actionLoading: boolean;
  alertMessage: string | null;
  alertType: LoanAlertType | null;
  dashboardCounts: {
    all: number;
    approved: number;
    pending: number;
    declined: number;
  };
}

export type LoanAlertType = SimpleAlertType | 'error';

export interface LoanUiState {
  badge: string;
  color: string;
  iconKey: IconKey;
}

export type LoanMonthsResponse = number[];

type IconKey = keyof typeof LOAN_ICONS;

export interface ILoanDetails {
  id: string;
  userId: string;
  loanAmount: number;
  accountId: string;
  accountName: string;
  months: number;
  purpose: string;
  status: number;
  statusName: string;
  currency: string;
  address: IAddress;
  contactPerson: IContactPerson;
  interestRate: number;
  totalInterest: number;
  totalAmountToPay: number;
  monthlyPayment: number;
  remainingPayments: number;
  remainingBalance: number;
  firstPaymentDate: string;
  nextPaymentDate: string;
  lastPaymentDate: string;
  approvedAt: string;
  createdAt: string;
  friendlyName: string;
}

export interface IAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface IContactPerson {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}
