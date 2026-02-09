export enum TokenKey {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  VERIFY = 'verification_token',
  SIGNUP = 'signup_token',
  CHALLENGE = 'challenge_id',
  USER = 'user',
  RESET_PASSWORD = 'reset_password_token',
}

export enum Routes {
  SIGN_IN = '/auth/sign-in',
  SIGN_UP = '/auth/sign-up',
  ROTGOT_PASSWORD = '/auth/forgot-password',
  RESET_PASSWORD = '/auth/reset-password',
  OTP_SIGN_IN = '/auth/verify-otp',
  OTP_SIGN_UP = '/auth/verify-otp-register',
  OTP_FORGOT_PASSWORD = '/auth/verify-otp-reset',
  PHONE = '/auth/phone',
  ERROR_PAGE = '/auth/error-info',
  DASHBOARD = '/bank/dashboard'
}

export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/mfa/verify',
  '/auth/signup',
] as const;
