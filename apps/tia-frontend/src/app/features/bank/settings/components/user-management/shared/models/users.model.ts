import { User } from '@tia/shared/models/user-info/user-info.models';

export interface IUser extends User {
  role: 'CONSUMER' | 'SUPPORT';
  isBlocked: boolean;
  createdAt: string;
}

export interface DetailRow {
  label: string;
  value: string | number | boolean | null | undefined;
  type?: 'text' | 'date' | 'status' | 'role';
}

export interface IUserDetail extends IUser {
  pId: string;
  phone: string;
  phoneVerifiedAt: string;
  avatar: string;
  avatarUrl?: string | null;
}

export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  pId: string;
  role: string;
  isBlocked: boolean;
}

export interface IBlockUserRequest {
  isBlocked: boolean;
}

export type IModalState = 'none' | 'details' | 'edit' | 'delete';
