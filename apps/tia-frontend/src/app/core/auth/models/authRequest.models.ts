export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IMfaVerifyRequest {
  challengeId: string;
  code: string;
}

export interface IRefreshTokenRequest {
  refresh_token: string;
}

export interface SendVerificationResponse {
  message: string,
  challengeId: string,
  method: string;
}

export interface OtpResponse {
  message: string;
}
