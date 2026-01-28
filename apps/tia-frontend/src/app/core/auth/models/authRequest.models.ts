export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IMfaVerifyRequest {
  challengeId: string;
  code: string;
}

export interface ISignUpResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  signup_token: string;
}

export interface SendVerificationResponse {
  message: 'string',
  challengeId: string,
  method: string;
}

export interface OtpResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordVerifyRequest {
  challengeId: string;
  code: string;
}

export interface CreateNewPasswordRequest {
  password: string;
}

export interface ResendOtpRequest {
  challengeId: string;
}