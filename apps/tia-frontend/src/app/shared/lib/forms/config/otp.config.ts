import { OtpConfig } from '../models/otp.model';

export const OTP_DEFAULTS: OtpConfig = {
  length: 6,
  inputType: 'number',
  placeholder: '',
};

export const OTP_ALLOWED_KEYS = [
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
  'Delete',
  'Enter',
] as const;
