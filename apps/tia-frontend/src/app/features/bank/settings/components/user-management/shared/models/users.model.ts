import { User } from '@tia/shared/models/user-info/user-info.models';

export interface IUser extends User {
  role: 'CONSUMER' | 'SUPPORT';
  isBlocked: boolean;
  createdAt: string;
}

export interface IUserDetail extends IUser {
  pId: string;
  phone: string;
  phoneVerifiedAt: string;
}

export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  role: string;
  isBlocked: boolean;
}

export interface IBlockUserRequest {
  isBlocked: boolean;
}

export type IModalState = 'none' | 'details' | 'edit' | 'delete';
