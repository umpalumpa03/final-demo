export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface signUpResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  signup_token: string;
}
