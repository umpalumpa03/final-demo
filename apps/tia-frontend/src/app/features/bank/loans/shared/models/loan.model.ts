import { Account } from '@tia/shared/models/accounts/accounts.model';
import { LOAN_ICONS } from '../config/loan-icons.config';
import { LoanPurpose } from './loan-request.model';
import { IPrepaymentCalcResponse, PrepaymentOption } from './prepayment.model';

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
  months: number[];
  purposes: LoanPurpose[];
  accounts: Account[];
  prepaymentOptions: PrepaymentOption[];
  loading: boolean;
  error: string | null;
  filterStatus: number | null;
  calculationResult: IPrepaymentCalcResponse | null;
  activeChallengeId: string | null;
  actionLoading: boolean;
}

export interface LoanUiState {
  badge: string;
  color: string;
  iconKey: IconKey;
}

export type LoanMonthsResponse = number[];

type IconKey = keyof typeof LOAN_ICONS;
