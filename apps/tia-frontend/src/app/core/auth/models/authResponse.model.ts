export interface IloginResponse {
  status: string;
  challengeId?: string;
  method?: string;
  reason?: string;
  verification_token?: string;
}

export interface IMfaVerifyResponse {
  access_token: string;
  refresh_token: string;
}

export interface ISignUpResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  signup_token: string;
}

export interface SendVerificationResponse {
  message: 'string';
  challengeId: string;
  method: string;
}

export interface OtpResponse {
  message: string;
}

export interface ILogoutResponse {
  success: boolean;
}
