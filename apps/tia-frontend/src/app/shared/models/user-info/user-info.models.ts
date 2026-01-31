export type UserRole = 'CONSUMER' | 'ADMIN';

export interface IUserInfo {
  fullName: string | null;
  theme: string | null;
  language: string | null;
  avatar: string | null;
  role: UserRole | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}
