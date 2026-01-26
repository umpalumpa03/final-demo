export interface IloginResponse {
  status: string;
  challengId?: string;
  method?: string;
  reason?: string;
  verification_token?: string;
}

export interface IMfaVerifyResponse {
    access_token: string
    refresh_token: string
}