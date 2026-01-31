import { OtpVerificationConfig, OtpVerificationType } from "../models/otp-verification.models";

export const getOtpVerificationConfig = (type: OtpVerificationType): OtpVerificationConfig => {
  switch (type) {
    case 'sign-in':
      return {
        title: 'Verify Your Identity',
        subText: 'Enter the 4-digit code sent to your email',
        submitBtnName: 'Verify',
        backLink: '/auth/sign-in',
        backLinkText: 'Back to Sign In',
        iconUrl: '/images/svg/auth/otp-icon.svg',
      } as const;
    case 'sign-up':
      return {
        title: 'Verify Phone Number',
        subText: 'Enter the 4-digit code sent to your email to complete registration',
        submitBtnName: 'Verify & Continue',
        backLink: '/auth/sign-up',
        backLinkText: 'Back to Sign Up',
        iconUrl: '/images/svg/auth/otp-icon.svg',
      } as const;
    case 'reset-password':
      return {
        title: 'Reset Your Password',
        subText: 'Enter the 4-digit code sent to your email',
        submitBtnName: 'Verify',
        backLink: '/auth/forgot-password',
        backLinkText: 'Back to Forgot Password',
        iconUrl: '/images/svg/auth/otp-icon.svg',
      } as const;
    case 'verify-email':
      return {
        title: 'Verify Your Email',
        subText: 'Enter the 4-digit code sent to your email',
        submitBtnName: 'Verify',
        backLink: '/auth/sign-in',
        backLinkText: 'Back to Sign In',
        iconUrl: '/images/svg/auth/otp-icon.svg',
      } as const;
  }
};