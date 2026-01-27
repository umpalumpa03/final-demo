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
  loading: boolean;
  error: string | null;
  filterStatus: number | null;
}
