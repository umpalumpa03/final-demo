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

export const UserSuccessKeys = {
  DELETE: 'settings.user-management.alerts.success.delete_success',
  UPDATE: 'settings.user-management.alerts.success.update_success',
  BLOCK: 'settings.user-management.alerts.success.block_success',
  UNBLOCK: 'settings.user-management.alerts.success.unblock_success',
} as const;

export const UserErrorKeys = {
  LOAD_USERS: 'settings.user-management.alerts.error.load_error',
  LOAD_DETAILS: 'settings.user-management.alerts.error.details_error',
  DELETE: 'settings.user-management.alerts.error.delete_error',
  UPDATE: 'settings.user-management.alerts.error.update_error',
  BLOCK: 'settings.user-management.alerts.error.block_error',
  NETWORK_ERROR: 'settings.user-management.alerts.error.network_error',
} as const;
