import { TestBed } from '@angular/core/testing';
import { UserManagementStore } from './user-management.store';
import { UserManagementService } from '../shared/services/user-management.service';
import { of, throwError } from 'rxjs';
import { IUser, IUserDetail } from '../shared/models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserManagementStore', () => {
  let store: InstanceType<typeof UserManagementStore>;
  let service: {
    getAllUsers: ReturnType<typeof vi.fn>;
    getUserById: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
    blockUser: ReturnType<typeof vi.fn>;
  };

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
    const serviceMock = {
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      blockUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UserManagementStore,
        { provide: UserManagementService, useValue: serviceMock },
      ],
    });

    store = TestBed.inject(UserManagementStore);
    service = TestBed.inject(UserManagementService) as any;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
    expect(store.userCount()).toBe(0);
  });

  it('should load users successfully', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));

    store.loadUsers();

    expect(store.loading()).toBe(false);
    expect(store.users()).toEqual(mockUsers);
    expect(store.userCount()).toBe(1);
    expect(store.error()).toBe(null);
  });

  it('should load user details successfully', () => {
    service.getUserById.mockReturnValue(of(mockUserDetail));

    store.loadUserDetails('1');

    expect(store.actionLoading()).toBe(false);
    expect(store.selectedUser()).toEqual(mockUserDetail);
    expect(store.error()).toBe(null);
    expect(service.getUserById).toHaveBeenCalledWith('1');
  });

  it('should handle load user details error', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found',
    });
    service.getUserById.mockReturnValue(throwError(() => errorResponse));

    store.loadUserDetails('99');

    expect(store.actionLoading()).toBe(false);
    expect(store.selectedUser()).toBeNull();
    expect(store.error()).toBe(
      'Http failure response for (unknown url): 404 Not Found',
    );
  });

  it('should clear selected user', () => {
    service.getUserById.mockReturnValue(of(mockUserDetail));
    store.loadUserDetails('1');
    expect(store.selectedUser()).not.toBeNull();

    store.clearSelectedUser();
    expect(store.selectedUser()).toBeNull();
  });
});
