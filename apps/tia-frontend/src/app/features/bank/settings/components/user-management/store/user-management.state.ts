import { IUser, IUserDetail } from '../shared/models/users.model';

type UserState = {
  users: IUser[];
  selectedUser: IUserDetail | null;
  userCache: Record<string, IUserDetail>;
  loading: boolean;
  actionLoading: boolean;
  processingIds: string[];
  error: string | null;
};

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  userCache: {},
  loading: false,
  actionLoading: false,
  processingIds: [],
  error: null,
};
