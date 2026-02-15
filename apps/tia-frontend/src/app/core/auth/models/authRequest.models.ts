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
  remainingAttempts?: number;
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

export interface OtpInitSettings {
  otp: {
    expirationMinutes: number;
    maxResendAttempts: number;
    maxVerifyAttempts: number;
    resendTimeoutMs: number;
  };
}