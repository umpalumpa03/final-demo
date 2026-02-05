import { Signal, computed } from '@angular/core';
import { SearchableUser } from '../models/user-search.model';

export class UserSearchService {
  static filterUsers<T extends SearchableUser>(users: T[], query: string): T[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return users;

    return users.filter((user) => {
      const searchStr = [
        user.firstName,
        user.lastName,
        user.email,
        user.username,
        user.role,
      ]
        .join(' ')
        .toLowerCase();

      return searchStr.includes(normalizedQuery);
    });
  }

  static createFilteredUsersComputed<T extends SearchableUser>(
    usersSignal: Signal<T[]>,
    searchQuerySignal: Signal<string>,
  ) {
    return computed(() => {
      const query = searchQuerySignal();
      const users = usersSignal();
      return this.filterUsers(users, query);
    });
  }
}
