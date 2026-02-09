import { IUser } from "../../../shared/models/approve-models/accounts-models/pending-accounts.models";

export function formatUserFullName(user: IUser | undefined): string {
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
}
