export type OtpVerificationType =
  | 'otp'
  | 'sign-up'
  | 'forgot-password'

export interface IOtpVerificationConfig {
  title?: string;
  subText?: string;
  submitBtnName?: string;
  backLink?: string;
  backLinkText?: string;
  iconUrl?: string;
}

export interface IVerified {
  isCalled: boolean;
  otp: string | null;
}
