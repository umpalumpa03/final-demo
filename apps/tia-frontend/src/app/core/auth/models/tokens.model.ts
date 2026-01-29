export enum TokenKey {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  VERIFY = 'verification_token',
  SIGNUP = 'signup_token',
}

export enum Routes {
  SIGN_IN = 'auth/sign-in',
  SIGN_UP = 'sign-up',
  ROTGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  OTP_SIGN_IN = 'verify-otp',
  OTP_SIGN_UP = 'verify-otp-register',
  OTP_FORGOT_PASSWORD = 'verify-otp-reset',
  SIGN_UP_SUCCESS = 'signup-success',
  FORGOT_PASSWORD_SUCCESS = 'register-success',
  PHONE = 'phone'
}

export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/mfa/verify',
  '/auth/signup',
] as const;
