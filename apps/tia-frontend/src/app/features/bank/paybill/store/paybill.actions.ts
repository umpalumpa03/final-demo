import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  BillDetails,
  ConfirmPaymentPayload,
  PaybillCategory,
  PaybillPayload,
  PaybillProvider,
  ProceedPaymentPayload,
  ProceedPaymentResponse,
} from '../models/paybill.model';

export const PaybillActions = createActionGroup({
  source: 'Paybill API',
  events: {
    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: PaybillCategory[] }>(),
    'Load Categories Failure': props<{ error: string }>(),
    'Select Category': props<{ categoryId: string }>(),
    'Load Providers Success': props<{ providers: PaybillProvider[] }>(),
    'Load Providers Failure': props<{ error: string }>(),
    'Select Provider': props<{ providerId: string }>(),
    'Check Bill': props<{ serviceId: string; accountNumber: string }>(),
    'Check Bill Success': props<{ details: BillDetails }>(),
    'Check Bill Failure': props<{ error: string }>(),
    'Clear Selection': emptyProps(),
    'Set Payment Step': props<{ step: string }>(),
    'Set Payment Payload': props<{ data: PaybillPayload }>(),
    'Proceed Payment': props<{ payload: ProceedPaymentPayload }>(),
    'Proceed Payment Success': props<{ response: ProceedPaymentResponse }>(),
    'Proceed Payment Failure': props<{ error: string }>(),
    'Confirm Payment': props<{ payload: ConfirmPaymentPayload }>(),
    'Confirm Payment Success': emptyProps(),
    'Confirm Payment Failure': props<{ error: string }>(),
  },
});
