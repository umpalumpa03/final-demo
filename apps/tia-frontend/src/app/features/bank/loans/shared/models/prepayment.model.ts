export interface PrepaymentOption {
  isActive: boolean;
  prepaymentValue: string;
  prepaymentDisplayName: string;
}

export interface IPrepaymentResponse {
  prepaymentOptions: PrepaymentOption[];
}

export interface RadioOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  description?: string;
}

export interface PrepaymentCalculationPayload {
  loanId: string;
  type: 'full' | 'partial';
  amount?: number;
  loanPartialPaymentType?: string;
}
