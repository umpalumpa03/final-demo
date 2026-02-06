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

export type PrepaymentStep = 'options' | 'review' | 'otp';

export interface PrepaymentCalculationPayload {
  loanId: string;
  type: 'full' | 'partial';
  amount?: number;
  loanPartialPaymentType?: string;
}

export interface IPrepaymentCalcItem {
  text: string;
  amount: number;
}

export interface IPartialPrepaymentResponse {
  displayedInfo: IPrepaymentCalcItem[];
}

export interface IFullPrepaymentResponse {
  items: IPrepaymentCalcItem[];
}

export interface IPrepaymentCalcResponse {
  displayedInfo: IPrepaymentCalcItem[];
}

export interface IInitiatePrepaymentRequest {
  loanId: string;
  loanPrepaymentOption: 'full' | 'partial';
  loanPartialPaymentType?: string;
  amount?: number;
  paymentAccountId: string;
}

export interface IInitiatePrepaymentResponse {
  success: boolean;
  message: string;
  verify?: {
    challengeId: string;
    method: string;
  };
}

export interface IVerifyPrepaymentRequest {
  challengeId: string;
  code: string;
}

export interface IVerifyPrepaymentResponse {
  success: boolean;
  message: string;
}

export interface IPrepaymentInfoItem {
  text: string;
  amount: number;
}

export interface IPrepaymentCalcResponse {
  displayedInfo: IPrepaymentCalcItem[];
  monthlyPayment?: number;
  totalInterestSaved?: number;
  newEndDate?: string;
  loanId?: string;
  prepaymentAmount?: number;
}

export interface PrepaymentCalculationResult extends IPrepaymentCalcResponse {}
