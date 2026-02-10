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
    'Init Repeat Process': emptyProps(),
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
      message?: string;
    }>(),
    'Create Templates Groups Failure': props<{
      error: string;
    }>(),
    'Delete Template': props<{
      templateId: string;
    }>(),
    'Delete Template Success': props<{
      templateId: string;
      message: string;
    }>(),
    'Delete Template Failure': props<{
      error: string;
    }>(),
    'Rename Template': props<{
      templateId: string;
      nickName: string;
    }>(),
    'Rename Template Success': props<{
      template: Templates;
      message?: string;
    }>(),
    'Rename Template Failure': props<{
      error: string;
    }>(),
    'Delete Template Group': props<{
      groupId: string;
    }>(),
    'Delete Template Group Success': props<{
      message: string;
      groupId: string;
    }>(),
    'Delete Template Group Failure': props<{
      error: string;
    }>(),
    'Rename Template Group': props<{
      groupId: string;
      groupName: string;
    }>(),
    'Rename Template Group Success': props<{
      templateGroup: CreateTemplateGroupResponse;
      groupId: string;
      message: string;
    }>(),
    'Rename Template Group Failure': props<{
      error: string;
    }>(),
    'Move Template': props<{
      groupId: string | null;
      templateId: string;
    }>(),
    'Move Template Success': props<{
      message: string;
      groupId: string | null;
      templateId: string;
    }>(),
    'Move Template Failure': props<{
      error: string;
    }>(),
    'Create Template': props<{
      serviceId: string;
      identification: PaybillIdentification;
      nickname: string;
    }>(),
    'Create Template Success': props<{
      payload: any;
      message: string;
    }>(),
    'Create Template Failure': props<{ error: string }>(),
    'Select Provider': props<{
      providerId: string;
      level: number;
    }>(),
    'Load Child Providers Success': props<{
      providers: PaybillProvider[];
      level: number;
    }>(),
    'Load Child Providers Failure': props<{
      error: string;
    }>(),
    'Check Bill For Template': props<{
      serviceId: string;
      identification: Record<string, string>;
      nickname: string;
    }>(),
    'Check Bill for Template Failure': props<{
      error: string;
    }>(),

    'Clear Payment Details': emptyProps(),
    'Add Checked Items': props<{
      selectedItems: Templates[];
    }>(),
    'Set Distributed Amount': props<{ amount: number }>(),
    'Set total Amount': props<{ amount: number }>(),
    'Clear Payment Info': emptyProps(),
  },
});
