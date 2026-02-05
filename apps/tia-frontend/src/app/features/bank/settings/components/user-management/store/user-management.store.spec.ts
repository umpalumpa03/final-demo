import { TestBed } from '@angular/core/testing';
import { UserManagementStore } from './user-management.store';
import { UserManagementService } from '../shared/services/user-management.service';
import { ProfilePhotoApiService } from '@tia/shared/services/profile-photo/profile-photo.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserManagementStore', () => {
  let store: InstanceType<typeof UserManagementStore>;
  let service: any;
  let avatarService: any;
  const mockUsers = [{ id: '1', firstName: 'A', role: 'CONSUMER' }];

  beforeEach(() => {
    service = {
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      blockUser: vi.fn(),
    };
    avatarService = {
      getCurrentUserAvatar: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        UserManagementStore,
        { provide: UserManagementService, useValue: service },
        { provide: ProfilePhotoApiService, useValue: avatarService },
      ],
    });
    store = TestBed.inject(UserManagementStore);
  });

  it('should load users success/error', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    expect(store.users()).toEqual(mockUsers);
    expect(store.userCount()).toBe(1);
    expect(store.loading()).toBe(false);

    service.getAllUsers.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    store.loadUsers();
    expect(store.error()).toContain('500');
  });

  it('should load details success/error', () => {
    service.getUserById.mockReturnValue(of(mockUsers[0]));
    store.loadUserDetails('1');
    expect(store.selectedUser()).toEqual({ ...mockUsers[0], avatarUrl: null });
    expect(store.actionLoading()).toBe(false);

    service.getUserById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    store.loadUserDetails('1');
    expect(store.error()).toContain('404');
  });

  it('should load details with avatar', () => {
    const userWithAvatar = { ...mockUsers[0], avatar: 'avatar123' };
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    service.getUserById.mockReturnValue(of(userWithAvatar));
    avatarService.getCurrentUserAvatar.mockReturnValue(of(mockBlob));

    store.loadUserDetails('1');
    expect(store.selectedUser()?.avatarUrl).toBeTruthy();
  });

  it('should update user and update local state', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();

    const updated = { ...mockUsers[0], firstName: 'Edited' };
    service.updateUser.mockReturnValue(of(updated));

    store.updateUser({ id: '1', data: {} as any });

    expect(store.users()[0].firstName).toBe('Edited');
    expect(store.selectedUser()).toEqual(updated);
    expect(store.actionLoading()).toBe(false);
  });

  it('should delete user and filter local state', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();

    service.deleteUser.mockReturnValue(of(null));
    store.deleteUser('1');
    expect(store.users().length).toBe(0);
    expect(store.actionLoading()).toBe(false);
  });

  it('should toggle block status', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();

    const blocked = { ...mockUsers[0], isBlocked: true };
    service.blockUser.mockReturnValue(of(blocked));

    store.toggleBlockStatus({ id: '1', isBlocked: true });
    expect(store.users()[0].isBlocked).toBe(true);
    expect(store.actionLoading()).toBe(false);
  });

  it('should handle util methods', () => {
    store.clearSelectedUser();
    expect(store.selectedUser()).toBeNull();

    store.resetSelection();
    expect(store.selectedUser()).toBeNull();
    expect(store.error()).toBeNull();
  });
});
