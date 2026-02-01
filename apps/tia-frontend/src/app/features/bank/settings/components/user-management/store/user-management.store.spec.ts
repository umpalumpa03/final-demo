import { TestBed } from '@angular/core/testing';
import { UserManagementStore } from './user-management.store';
import { UserManagementService } from '../shared/services/user-management.service';
import { of, throwError } from 'rxjs';
import { IUser } from '../shared/models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
      role: 'consumer',
      isBlocked: false,
      createdAt: '2024-01-01',
    },
  ];

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
    service = TestBed.inject(UserManagementService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
  });

  it('should load users successfully', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    expect(store.loading()).toBe(false);
    expect(store.users()).toEqual(mockUsers);
    expect(store.error()).toBe(null);
    expect(service.getAllUsers).toHaveBeenCalled();
  });

  it('should handle load users error', () => {
    const errorMsg = 'Network Error';
    service.getAllUsers.mockReturnValue(
      throwError(() => ({ message: errorMsg })),
    );
    store.loadUsers();
    expect(store.loading()).toBe(false);
    expect(store.users()).toEqual([]);
    expect(store.error()).toBe(errorMsg);
  });
});
