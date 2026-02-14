export type OtpVerificationType = 'otp' | 'sign-up' | 'forgot-password';

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

export interface OtpSettings {
  expirationMinutes: number;
  maxResendAttempts: number;
  maxVerifyAttempts: number;
  resendTimeoutMs: number;
}

export interface OtpSettingsConfiguration {
  otp: OtpSettings;
}

export interface OtpResponse {
  message: string;
}
