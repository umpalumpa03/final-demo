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

export interface PaybillState {
  categories: PaybillCategory[];
  providers: PaybillProvider[];
  selectedCategoryId: string | null;
  selectedProviderId: string | null;
  loading: boolean;
  error: string | null;
  selectedProvider: PaybillProvider | null;
  verifiedDetails: BillDetails | null;
  currentStep: string;
  paymentPayload: string | null;
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
