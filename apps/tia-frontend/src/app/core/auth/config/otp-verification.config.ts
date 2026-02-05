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
        title: 'auth.otp-forgot-password.title',
        subText: 'auth.otp-forgot-password.subText',
        submitBtnName: 'auth.otp-forgot-password.submitBtnName',
        backLink: '/auth/forgot-password',
        backLinkText: 'auth.otp-forgot-password.backLinkText',
        iconUrl: 'images/svg/auth/secured-blue.svg',
      } as const;
  }
};