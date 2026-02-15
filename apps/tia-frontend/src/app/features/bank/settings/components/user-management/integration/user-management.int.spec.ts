import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import { patchState } from '@ngrx/signals';
import {
  TestContext,
  setupUserManagementTest,
  cleanupUserManagementTest,
  mockUsersList,
  mockUserDetail,
} from './user-management.test-helpers';
import { IUpdateUserRequest } from '../shared/models/users.model';

describe('User Management Integration', () => {
  let ctx: TestContext;
  const apiUrl = `${environment.apiUrl}/users/management`;

  beforeEach(async () => {
    ctx = await setupUserManagementTest();
  });

  afterEach(() => {
    cleanupUserManagementTest(ctx.httpMock);
  });

  it('should load all users successfully', async () => {
    ctx.store.loadUsers({});
    expect(ctx.store.loading()).toBe(true);

    const req = ctx.httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsersList);

    await vi.waitFor(() => {
      expect(ctx.store.users().length).toBe(2);
      expect(ctx.store.loading()).toBe(false);
      expect(ctx.store.userCount()).toBe(2);
    });
  });

  it('should load user details and process avatar blob', async () => {
    const userId = 'user-1';

    ctx.store.loadUserDetails(userId);
    expect(ctx.store.actionLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUserDetail);

    await vi.waitFor(() => {
      const selected = ctx.store.selectedUser();
      expect(selected).toBeTruthy();
      expect(selected?.id).toBe(userId);
      expect(selected?.avatarUrl).toBe('blob:fake-url');
      expect(ctx.store.actionLoading()).toBe(false);
    });
  });

  it('should use cache for user details on second visit', async () => {
    const userId = 'user-1';

    patchState(ctx.store as any, {
      userCache: { [userId]: mockUserDetail },
    });

    ctx.store.loadUserDetails(userId);

    ctx.httpMock.expectNone(`${apiUrl}/${userId}`);

    expect(ctx.store.selectedUser()).toEqual(mockUserDetail);
  });

  it('should update user and refresh list locally', async () => {
    patchState(ctx.store as any, { users: mockUsersList });

    const userId = 'user-1';
    const updateData: IUpdateUserRequest = {
      firstName: 'Johnny',
      lastName: 'Doe',
      role: 'SUPPORT',
      isBlocked: false,
    };

    ctx.store.updateUser({ id: userId, data: updateData });
    expect(ctx.store.actionLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);

    const updatedUser = { ...mockUserDetail, ...updateData };
    req.flush(updatedUser);

    await vi.waitFor(() => {
      const listUser = ctx.store.users().find((u) => u.id === userId);
      expect(listUser?.firstName).toBe('Johnny');
      expect(listUser?.role).toBe('SUPPORT');

      expect(ctx.store.selectedUser()?.firstName).toBe('Johnny');
      expect(ctx.store.actionLoading()).toBe(false);
    });
  });

  it('should delete user and remove from list locally', async () => {
    patchState(ctx.store as any, { users: mockUsersList });
    const userId = 'user-1';

    ctx.store.deleteUser(userId);
    expect(ctx.store.actionLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, message: 'Deleted' });

    await vi.waitFor(() => {
      expect(ctx.store.users().length).toBe(1);
      expect(ctx.store.users().find((u) => u.id === userId)).toBeUndefined();
      expect(ctx.store.actionLoading()).toBe(false);
    });
  });

  it('should toggle block status', async () => {
    patchState(ctx.store as any, { users: mockUsersList });
    const userId = 'user-1';

    ctx.store.toggleBlockStatus({ id: userId, isBlocked: true });

    expect(ctx.store.processingIds()).toContain(userId);

    const req = ctx.httpMock.expectOne(`${apiUrl}/${userId}/block`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ isBlocked: true });

    const blockedUser = { ...mockUserDetail, isBlocked: true };
    req.flush(blockedUser);

    await vi.waitFor(() => {
      const user = ctx.store.users().find((u) => u.id === userId);
      expect(user?.isBlocked).toBe(true);
      expect(ctx.store.processingIds()).not.toContain(userId);
    });
  });
});
