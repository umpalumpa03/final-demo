import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ILoan, LoanMonthsResponse } from '../shared/models/loan.model';
import { LoanPurpose } from '../shared/models/loan-request.model';
import {
  IInitiatePrepaymentRequest,
  IPrepaymentCalcResponse,
  IVerifyPrepaymentRequest,
  PrepaymentCalculationPayload,
  PrepaymentOption,
} from '../shared/models/prepayment.model';

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

    'Load Prepayment Options': emptyProps(),
    'Load Prepayment Options Success': props<{ options: PrepaymentOption[] }>(),
    'Load Prepayment Options Failure': props<{ error: string }>(),

    'Calculate Prepayment': props<{ payload: PrepaymentCalculationPayload }>(),
    'Calculate Prepayment Success': props<{
      result: IPrepaymentCalcResponse;
    }>(),
    'Calculate Prepayment Failure': props<{ error: string }>(),
    'Clear Calculation Result': emptyProps(),

    'Initiate Prepayment': props<{ payload: IInitiatePrepaymentRequest }>(),
    'Initiate Prepayment Success': props<{ challengeId: string }>(),
    'Initiate Prepayment Failure': props<{ error: string }>(),

    'Verify Prepayment': props<{ payload: IVerifyPrepaymentRequest }>(),
    'Verify Prepayment Success': emptyProps(),
    'Verify Prepayment Failure': props<{ error: string }>(),
  },
});
