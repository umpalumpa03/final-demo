export type OtpVerificationType = 'sign-in' | 'sign-up' | 'reset-password' | 'verify-email';

export interface OtpVerificationConfig {
  title: string;
  subText: string;
  submitBtnName: string;
  resendText: string;
  resendLinkText: string;
  backLink: string;
  backLinkText: string;
  showIcon: boolean;
  iconUrl: string;
}

export const getOtpVerificationConfig = (type: OtpVerificationType): OtpVerificationConfig => {
  switch (type) {
    case 'sign-in':
      return {
        title: 'Verify Your Identity',
        subText: 'Enter the 6-digit code sent to your email',
        submitBtnName: 'Verify',
        resendText: "Didn't receive the code?",
        resendLinkText: 'Resend',
        backLink: '/auth/sign-in',
        backLinkText: 'Back to Sign In',
        showIcon: true,
        iconUrl: '/images/svg/auth/otp-icon.svg',
      };
    case 'sign-up':
      return {
        title: 'Verify Phone Number',
        subText: 'Enter the 6-digit code sent to your email to complete registration',
        submitBtnName: 'Verify & Continue',
        resendText: "Didn't receive the code?",
        resendLinkText: 'Resend',
        backLink: '/auth/sign-up',
        backLinkText: 'Back to Sign Up',
        showIcon: true,
        iconUrl: '/images/svg/auth/otp-icon.svg',
      };
    case 'reset-password':
      return {
        title: 'Reset Your Password',
        subText: 'Enter the 6-digit code sent to your email',
        submitBtnName: 'Verify',
        resendText: "Didn't receive the code?",
        resendLinkText: 'Resend',
        backLink: '/auth/forgot-password',
        backLinkText: 'Back to Forgot Password',
        showIcon: true,
        iconUrl: '/images/svg/auth/otp-icon.svg',
      };
    case 'verify-email':
      return {
        title: 'Verify Your Email',
        subText: 'Enter the 6-digit code sent to your email',
        submitBtnName: 'Verify',
        resendText: "Didn't receive the code?",
        resendLinkText: 'Resend',
        backLink: '/auth/sign-in',
        backLinkText: 'Back to Sign In',
        showIcon: true,
        iconUrl: '/images/svg/auth/otp-icon.svg',
      };
    default:
      throw new Error(`Unknown OTP verification type: ${type}`);
  }
};