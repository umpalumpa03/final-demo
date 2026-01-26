export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IloginResponse {
  status: string;
  challengId?: string;
  method?: string;
  reason?: string;
  verification_token?: string;
}
