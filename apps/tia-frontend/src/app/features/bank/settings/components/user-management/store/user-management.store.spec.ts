import { TestBed } from '@angular/core/testing';
import { UserManagementStore } from './user-management.store';
import { UserManagementService } from '../shared/services/user-management.service';
import { of, throwError } from 'rxjs';
import { IUser, IUserDetail } from '../shared/models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserManagementStore', () => {
  let store: InstanceType<typeof UserManagementStore>;
  let service: any;

  const mockUsers: IUser[] = [
    {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      username: 'test',
      role: 'CONSUMER',
      isBlocked: false,
      createdAt: '2024-01-01',
    },
  ];

  const mockUserDetail: IUserDetail = {
    ...mockUsers[0],
    pId: '01010101010',
    phone: '555-555-5555',
    phoneVerifiedAt: '2024-01-01',
  };

  beforeEach(() => {
    service = {
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      blockUser: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        UserManagementStore,
        { provide: UserManagementService, useValue: service },
      ],
    });
    store = TestBed.inject(UserManagementStore);
  });

  it('should load users successfully', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    expect(store.users()).toEqual(mockUsers);
    expect(store.userCount()).toBe(1);
  });

  it('should handle load users error', () => {
    service.getAllUsers.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: 'Error', status: 500 })),
    );
    store.loadUsers();
    expect(store.error()).toContain('500');
  });

  it('should load user details successfully', () => {
    service.getUserById.mockReturnValue(of(mockUserDetail));
    store.loadUserDetails('1');
    expect(store.selectedUser()).toEqual(mockUserDetail);
  });

  it('should handle load user details error', () => {
    service.getUserById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    store.loadUserDetails('99');
    expect(store.error()).toContain('404');
  });

  it('should delete user successfully', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    service.deleteUser.mockReturnValue(of(null));
    store.deleteUser('1');
    expect(store.users()).toEqual([]);
  });

  it('should handle delete user error', () => {
    service.deleteUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    store.deleteUser('1');
    expect(store.error()).toContain('500');
  });

  it('should toggle block status successfully', () => {
    const blockedUser = { ...mockUsers[0], isBlocked: true };
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    service.blockUser.mockReturnValue(of(blockedUser));
    store.toggleBlockStatus({ id: '1', isBlocked: true });
    expect(store.users()[0].isBlocked).toBe(true);
  });

  it('should clear and reset selected user', () => {
    service.getUserById.mockReturnValue(of(mockUserDetail));
    store.loadUserDetails('1');
    store.clearSelectedUser();
    expect(store.selectedUser()).toBeNull();
    store.resetSelection();
    expect(store.selectedUser()).toBeNull();
    expect(store.error()).toBeNull();
  });
});
