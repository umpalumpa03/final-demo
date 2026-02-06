import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { UserSearchService } from './user-search.service';
import { SearchableUser } from '../models/user-search.model';

describe('UserSearchService', () => {
  const mockUsers: SearchableUser[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@test.com',
      username: 'jd',
      role: 'admin',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@test.com',
      username: 'js',
      role: 'user',
    },
  ];

  describe('filterUsers', () => {
    it('should filter users or return all', () => {
      expect(UserSearchService.filterUsers(mockUsers, '')).toEqual(mockUsers);
      expect(UserSearchService.filterUsers(mockUsers, '   ')).toEqual(
        mockUsers,
      );
      expect(UserSearchService.filterUsers(mockUsers, 'John')).toHaveLength(1);
      expect(UserSearchService.filterUsers(mockUsers, 'xyz')).toHaveLength(0);
    });
  });

  describe('createFilteredUsersComputed', () => {
    it('should create computed that reacts to changes', () => {
      const users = signal(mockUsers);
      const search = signal('john');
      const filtered = UserSearchService.createFilteredUsersComputed(
        users,
        search,
      );

      expect(filtered()).toHaveLength(1);
      search.set('');
      expect(filtered()).toHaveLength(2);
    });
  });
});
