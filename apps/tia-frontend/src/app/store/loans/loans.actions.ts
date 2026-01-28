import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ILoan } from '../../features/bank/loans/shared/models/loan.model';
import { ILoanRequest } from '../../features/bank/loans/shared/models/loan-request.model';

export const LoansCreateActions = createActionGroup({
  source: 'Loans Global API',
  events: {
    'Request Loan': props<{ request: ILoanRequest }>(),
    'Request Loan Success': props<{ loan: ILoan }>(),
    'Request Loan Failure': props<{ error: string }>(),
    'Load Loans': emptyProps(),
  },
});
