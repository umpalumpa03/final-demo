export type OtpVerificationType = 'otp' | 'sign-up' | 'forgot-password';

export interface IOtpVerificationConfig {
  title?: string;
  subText?: string;
  submitBtnName?: string;
  backLink?: string;
  backLinkText?: string;
  iconUrl?: string;
}

export interface IOtpSettings {
  expirationMinutes: number;
  maxResendAttempts: number;
  maxVerifyAttempts: number;
  resendTimeoutMs: number;
  enabledOtpResends: string[]
}

export interface OtpSettingsConfiguration {
  otp: IOtpSettings;
}

export interface OtpResponse {
  message: string;
}
