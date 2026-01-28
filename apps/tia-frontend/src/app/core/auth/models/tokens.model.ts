export enum TokenKey {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  VERIFY = 'verification_token',
  SIGNUP = 'signup_token',
  CHALLENGE_ID = 'signup_challenge_id',
  FORGOT_PASSWORD_CHALLENGE = 'forgot_password_challenge_id',
  FORGOT_PASSWORD_ACCESS = 'forgot_password_access_token',
  FORGOT_PASSWORD_EMAIL = 'forgot_password_email',
}

export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/mfa/verify',
  '/auth/signup',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/forgot-password/verify',
  '/auth/create-new-password',
  '/auth/mfa/otp-resend',
  // '/auth/logout',
];
