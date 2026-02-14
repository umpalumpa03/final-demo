import { TestBed } from '@angular/core/testing';
import { UserManagementStore } from './user-management.store';
import { UserManagementService } from '../shared/services/user-management.service';
import { ProfilePhotoApiService } from '@tia/shared/services/profile-photo/profile-photo.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

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
    avatarService = { getCurrentUserAvatar: vi.fn() };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        UserManagementStore,
        { provide: UserManagementService, useValue: service },
        { provide: ProfilePhotoApiService, useValue: avatarService },
      ],
    });
    store = TestBed.inject(UserManagementStore);
  });

  it('should load users once if already loaded', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    expect(store.users()).toEqual(mockUsers);
    service.getAllUsers.mockClear();
    store.loadUsers();
    expect(service.getAllUsers).not.toHaveBeenCalled();
  });

  it('should use cached user details', () => {
    const user = { ...mockUsers[0], avatarUrl: null };
    service.getUserById.mockReturnValue(of(mockUsers[0]));
    store.loadUserDetails('1');
    expect(store.selectedUser()).toEqual(user);
    service.getUserById.mockClear();
    store.loadUserDetails('1');
    expect(service.getUserById).not.toHaveBeenCalled();
  });

  it('should load user with avatar', () => {
    const userWithAvatar = { ...mockUsers[0], avatar: 'avatar123' };
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    service.getUserById.mockReturnValue(of(userWithAvatar));
    avatarService.getCurrentUserAvatar.mockReturnValue(of(mockBlob));
    store.loadUserDetails('1');
    expect(store.selectedUser()?.avatarUrl).toBeTruthy();
  });

  it('should update user and clear cache', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    const updated = { ...mockUsers[0], firstName: 'Edited' };
    service.updateUser.mockReturnValue(of(updated));
    store.updateUser({ id: '1', data: {} as any });
    expect(store.users()[0].firstName).toBe('Edited');
    expect(store.selectedUser()).toEqual(updated);
  });

  it('should handle updateUser error', () => {
    service.updateUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );
    store.updateUser({ id: '1', data: {} as any });
    expect(store.error()).toContain('400');
  });

  it('should delete user and clear cache', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    service.deleteUser.mockReturnValue(of(null));
    store.deleteUser('1');
    expect(store.users().length).toBe(0);
  });

  it('should handle deleteUser error', () => {
    service.deleteUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    store.deleteUser('1');
    expect(store.error()).toContain('500');
  });

  it('should toggle block status', () => {
    service.getAllUsers.mockReturnValue(
      of([{ ...mockUsers[0], isBlocked: false }]),
    );
    store.loadUsers();
    const blocked = { ...mockUsers[0], isBlocked: true };
    service.blockUser.mockReturnValue(of(blocked));
    store.toggleBlockStatus({ id: '1', isBlocked: true });
    expect(store.users()[0].isBlocked).toBe(true);
  });

  it('should update selected user on block toggle', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    service.getUserById.mockReturnValue(of(mockUsers[0]));
    store.loadUserDetails('1');
    const blocked = { ...mockUsers[0], isBlocked: true };
    service.blockUser.mockReturnValue(of(blocked));
    store.toggleBlockStatus({ id: '1', isBlocked: true });
    expect(store.selectedUser()?.isBlocked).toBe(true);
  });

  it('should handle toggleBlockStatus error', () => {
    service.blockUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );
    store.toggleBlockStatus({ id: '1', isBlocked: true });
    expect(store.error()).toContain('400');
  });

  it('should handle util methods', () => {
    store.clearSelectedUser();
    expect(store.selectedUser()).toBeNull();
    store.resetSelection();
    expect(store.selectedUser()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should reset store', () => {
    service.getAllUsers.mockReturnValue(of(mockUsers));
    store.loadUsers();
    store.reset();
    expect(store.users().length).toBe(0);
  });
});
