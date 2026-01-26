export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IMfaVerifyRequest {
  challengeId: string;
  code: string
}
