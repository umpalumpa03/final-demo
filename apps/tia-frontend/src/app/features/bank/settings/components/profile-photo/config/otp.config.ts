import { IOtpVerificationConfig } from "@tia/core/otp-verification/models/otp-verification.models";

export const personalInfoOtpConfig: IOtpVerificationConfig = {
  title: 'settings.profile-photo.verifyPhoneUpdate',
  subText: 'settings.profile-photo.otpDescription',
  submitBtnName: 'settings.profile-photo.verify',
  backLinkText: 'common.buttons.cancel',
  iconUrl: 'images/svg/auth/secured-blue.svg',
} as const;
