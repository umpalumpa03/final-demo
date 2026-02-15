import { IOtpVerificationConfig } from "@tia/core/otp-verification/models/otp-verification.models";

export const CARD_OTP_MODAL_CONFIG: IOtpVerificationConfig = {
  iconUrl: '/images/svg/auth/secured-blue.svg',
  title: 'Verify Card Details',
  subText: 'Enter the 4-digit code to view sensitive card information',
  submitBtnName: 'Verify OTP',
  backLinkText: 'Cancel',
};