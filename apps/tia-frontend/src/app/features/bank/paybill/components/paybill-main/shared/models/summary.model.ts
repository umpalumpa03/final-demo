export interface SummaryField {
  label: string;
  value: string | number;
  isTotal?: boolean;
  canTranslate?: boolean;
}

export type SummaryType = 'verified' | 'otp' | 'confirm-payment';