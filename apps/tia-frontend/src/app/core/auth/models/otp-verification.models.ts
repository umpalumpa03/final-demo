export type OtpVerificationType =
  | 'sign-in'
  | 'sign-up'
  | 'reset-password'
  | 'verify-email';

export interface OtpVerificationConfig {
  title: string;
  subText: string;
  submitBtnName: string;
  backLink: string;
  backLinkText: string;
  iconUrl: string;
}

export interface IVerified {
  isCalled: boolean;
  otp: string | null;
}
