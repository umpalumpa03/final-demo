import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';

export const VERIFY_LOAN: OtpConfig = {
  label: 'OTP Code *',
  length: 4,
  inputType: 'number',
} as const;
