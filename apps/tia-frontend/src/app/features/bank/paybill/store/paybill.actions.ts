import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  BillDetails,
  ConfirmPaymentPayload,
  PaybillCategory,
  PaybillIdentification,
  PaybillPayload,
  PaybillPaymentDetails,
  PaybillProvider,
  ProceedPaymentPayload,
  ProceedPaymentResponse,
} from '../components/paybill-main/shared/models/paybill.model';
import {
  CreateTemplateGroupResponse,
  TemplateGroups,
  Templates,
} from '../components/paybill-templates/models/paybill-templates.model';
import { PaybillNotification } from './paybill.state';

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
    'Check Bill': props<{
      serviceId: string;
      identification: PaybillIdentification;
    }>(),
    'Set Transaction Provider': props<{ provider: PaybillProvider }>(),
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
    'Reset Payment Form': emptyProps(),
    'Clear Error': emptyProps(),
    'Add Notification': props<PaybillNotification>(),
    'Dismiss Notification': props<{ id: string }>(),
    'Clear All Notifications': emptyProps(),
    'Load Payment Details': props<{ serviceId: string }>(),
    'Load Payment Details Success': props<{ details: PaybillPaymentDetails }>(),
    'Load Payment Details Failure': props<{ error: string }>(),
  },
});

export const TemplatesPageActions = createActionGroup({
  source: 'Paybill Templates Page',
  events: {
    'Load Template Groups': emptyProps(),
    'Load Template Groups Success': props<{
      templateGroups: TemplateGroups[];
    }>(),
    'Load Template Groups Failure': props<{ error: string }>(),
    'Load Templates': emptyProps(),
    'Load Templates Success': props<{
      templates: Templates[];
    }>(),
    'Load Templates Failure': props<{ error: string }>(),
    'Create Templates Groups': props<{ groupName: string; templateIds: [] }>(),
    'Create Templates Groups Success': props<{
      templateGroup: CreateTemplateGroupResponse;
    }>(),
    'Create Templates Groups Failure': props<{
      error: string;
    }>(),
    'Delete Templates': props<{
      templateId: string;
    }>(),
    'Delete Templates Success': props<{
      templateId: string;
      message: string;
    }>(),
    'Delete Templates Failure': props<{
      error: string;
    }>(),
  },
});
