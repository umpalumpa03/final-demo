import { OtpVerificationConfig, OtpVerificationType } from "../models/otp-verification.models";

export const getOtpVerificationConfig = (type: OtpVerificationType): OtpVerificationConfig => {
  switch (type) {
    case 'sign-in':
      return {
        title: 'auth.otp-sign-in.title',
        subText: 'auth.otp-sign-in.subText',
        submitBtnName: 'auth.otp-sign-in.submitBtnName',
        backLink: '/auth/sign-in',
        backLinkText: 'auth.otp-sign-in.backLinkText',
        iconUrl: 'images/svg/auth/secured-blue.svg',
      } as const;
    case 'sign-up':
      return {
        title: 'auth.otp-sign-up.title',
        subText: 'auth.otp-sign-up.subText',
        submitBtnName: 'auth.otp-sign-up.submitBtnName',
        backLink: '/auth/sign-in',
        backLinkText: 'auth.otp-sign-up.backLinkText',
        iconUrl: 'images/svg/auth/phone-blue.svg',
      } as const;
    case 'forgot-password':
      return {
        title: 'Reset Your Password',
        subText: 'Enter the 4-digit code sent to your email',
        submitBtnName: 'Verify',
        backLink: '/auth/forgot-password',
        backLinkText: 'Back to Forgot Password',
        iconUrl: 'images/svg/auth/secured-blue.svg',
      } as const;
  }
};