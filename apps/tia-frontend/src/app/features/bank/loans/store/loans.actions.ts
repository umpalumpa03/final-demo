import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ILoan,
  ILoanDetails,
  LoanMonthsResponse,
} from '../shared/models/loan.model';
import { LoanPurpose } from '../shared/models/loan-request.model';
import {
  IInitiatePrepaymentRequest,
  IPrepaymentCalcResponse,
  IVerifyPrepaymentRequest,
  PrepaymentCalculationPayload,
  PrepaymentOption,
} from '../shared/models/prepayment.model';
import { SimpleAlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';

export const LoansActions = createActionGroup({
  source: 'Loans API',
  events: {
    'Load Loans': emptyProps(),
    'Load Loans Success': props<{ loans: ILoan[] }>(),
    'Load Loans Failure': props<{ error: string }>(),

    'Load Loan Details': props<{ id: string }>(),
    'Load Loan Details Success': props<{ details: ILoanDetails }>(),
    'Load Loan Details Failure': props<{ error: string }>(),
    'Clear Loan Details': emptyProps(),

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

    'Show Alert': props<{
      message: string;
      alertType: SimpleAlertType;
    }>(),
    'Start Closing Alert': emptyProps(),
    'Hide Alert': emptyProps(),
  },
});
