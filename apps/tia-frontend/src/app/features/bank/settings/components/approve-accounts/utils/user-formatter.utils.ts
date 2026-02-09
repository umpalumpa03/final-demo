import { IUser } from '../models/pending-accounts.models';

export function formatUserFullName(user: IUser | undefined): string {
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
}
