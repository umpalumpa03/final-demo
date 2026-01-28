export interface IloginResponse {
  status: string;
  challengeId?: string;
  method?: string;
  reason?: string;
  verification_token?: string;
}

export interface IMfaVerifyResponse {
    access_token: string
    refresh_token: string
}

export interface ForgotPasswordResponse {
  challengeId: string;
  method: string;
  maskedPhone: string;
}

export interface ForgotPasswordVerifyResponse {
  access_token: string;
}

export interface CreateNewPasswordResponse {
  success: boolean;
}

export interface ResendOtpResponse {
  success: boolean;
}

