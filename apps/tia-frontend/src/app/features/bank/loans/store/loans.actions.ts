import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ILoan, LoanMonthsResponse } from '../shared/models/loan.model';
import { LoanPurpose } from '../shared/models/loan-request.model';

export const LoansActions = createActionGroup({
  source: 'Loans API',
  events: {
    'Load Loans': emptyProps(),
    'Load Loans Success': props<{ loans: ILoan[] }>(),
    'Load Loans Failure': props<{ error: string }>(),

    'Set Filter': props<{ status: number | null }>(),

    'Rename Loan': props<{ id: string; name: string }>(),
    'Rename Loan Success': props<{ id: string; name: string }>(),
    'Rename Loan Failure': props<{ error: string }>(),

    'Load Months': emptyProps(),
    'Load Months Success': props<{ months: LoanMonthsResponse }>(),
    'Load Months Failure': props<{ error: string }>(),

    'Load Purposes': emptyProps(),
    'Load Purposes Success': props<{ purposes: LoanPurpose[] }>(),
    'Load Purposes Failure': props<{ error: string }>(),
  },
});
