export type UserRole = 'CONSUMER' | 'SUPPORT';

export interface IUserInfo {
  fullName: string | null;
  theme: string | null;
  language: string | null;
  hasCompletedOnboarding: boolean;
  avatar: string | null;
  role: UserRole | null;
  email: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}
