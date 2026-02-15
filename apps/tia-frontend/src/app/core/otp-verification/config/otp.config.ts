import { OtpSettingsConfiguration } from '../models/otp-verification.models';

export const DEFAULT_SETTING_CONFIG: OtpSettingsConfiguration = {
  otp: {
    expirationMinutes: 5,
    maxResendAttempts: 3,
    maxVerifyAttempts: 3,
    resendTimeoutMs: 60000,
    enabledOtpResends: ['AUTH', 'PHONE_RESEND', 'PERSONAL_INFO'],
  },
} as const;

export enum OtpResendTypes {
  PERSONAL_INFO = 'PERSONAL_INFO',
  CARD_DETAILS = 'CARD_DETAILS',
  PHONE_RESEND = 'PHONE_RESEND',
  TRANSFERS = 'TRANSFERS',
  PAY_BILL = 'PAY_BILL',
  LOANS = 'LOANS',
  CARDS = 'CARDS',
  RESET = 'RESET',
  AUTH = 'AUTH',
}
