import { PaybillDynamicFormValues } from '../../../../services/paybill-dynamic-form/models/dynamic-form.model';

export interface PaybillProvider {
  id: string;
  serviceName: string;
  categoryId: string;
  name?: string;
  parentId?: string;
  isFinal?: string | boolean;
}

export interface PaybillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  servicesQuantity: number;

  iconBgColor?: string;
  iconBgPath?: string;
  providers?: PaybillProvider[];
}

export interface BillDetails {
  valid: boolean;
  accountHolder: string;
  address: string;
  amountDue: number;
  dueDate: string;
  isExactAmount: boolean;
  minAmount?: number;
  maxAmount?: number;
  error?: string;
  billPeriod?: string;
}

export interface PaybillPayload {
  identification: PaybillIdentification;
  amount: number;
}

export interface VerifyChallenge {
  challengeId: string;
  method: string;
}

export interface ProceedPaymentResponse {
  verify?: VerifyChallenge;
  transferType: string;
  error?: string;
  message?: string;
  statusCode?: string;
}

export interface ConfirmPaymentPayload {
  challengeId: string;
  code: string;
}

export interface ProceedPaymentPayload {
  serviceId: string;
  identification: PaybillIdentification;
  amount: number;
  senderAccountId: string;
}

export interface PaybillIdentification {
  accountNumber?: string;
  phoneNumber?: string;
  policyNumber?: string;
  propertyCode?: string;
  tenantId?: string;
  [key: string]: string | undefined;
}

export interface PaybillFormVerifyEvent {
  value: PaybillDynamicFormValues;
}

export interface PaybillFormProceedEvent {
  amount: number;
  value: PaybillDynamicFormValues;
}

export interface PaybillField {
  id: string;
  label: string;
  required: boolean;
  type: string;
}

export interface PaybillPaymentDetails {
  serviceId: string;
  serviceName: string;
  fields: PaybillField[];
}
