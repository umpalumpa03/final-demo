export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
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
