export interface SummaryField {
  label: string;
  value: string | number;
  isTotal?: boolean;
}

export type SummaryType = 'verified' | 'otp' | 'confirm-payment';