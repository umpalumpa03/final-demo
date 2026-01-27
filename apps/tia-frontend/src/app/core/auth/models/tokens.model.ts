export enum TokenKey {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  VERIFY = 'verification_token',
  SIGNUP = 'signup_token',
}

export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/mfa/verify',
  '/auth/signup',
  '/auth/logout',
];
