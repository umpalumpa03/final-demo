import { LOAN_ICONS } from '../config/loan-icons.config';
import { LoanPurpose } from './loan-request.model';

export interface ILoan {
  id: string;
  loanAmount: number;
  accountId: string;
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
  loading: boolean;
  error: string | null;
  filterStatus: number | null;
}

export interface LoanUiState {
  badge: string;
  color: string;
  iconKey: IconKey;
}

export type LoanMonthsResponse = number[];

type IconKey = keyof typeof LOAN_ICONS;
