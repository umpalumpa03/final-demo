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
  message: string,
  challengeId: string,
  method: string;
}

export interface OtpResponse {
  message: string;
}