export interface PaybillProvider {
  id: string;
  serviceName: string;
  categoryId: string;
  name?: string;
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

// export interface PaybillState {
//   categories: PaybillCategory[];
//   providers: PaybillProvider[];
//   selectedCategoryId: string | null;
//   selectedProviderId: string | null;
//   loading: boolean;
//   error: string | null;
//   selectedProvider: PaybillProvider | null;
//   verifiedDetails: BillDetails | null;
//   currentStep: string;
//   paymentPayload: PaybillPayload | null;
//   challengeId: string | null;
//   templateGroups: TableGroups[];
// }

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
  accountNumber: string;
  amount: number;
}

export interface VerifyChallenge {
  challengeId: string;
  method: string;
}

export interface ProceedPaymentResponse {
  verify?: VerifyChallenge;
  transferType: string;
}

export interface ConfirmPaymentPayload {
  challengeId: string;
  code: string;
}

export interface ProceedPaymentPayload {
  serviceId: string;
  identification: {
    accountNumber: string;
  };
  amount: number;
  senderAccountId: string;
}
