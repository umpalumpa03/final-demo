import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { UserManagementStore } from '../../store/user-management.store';
import { UserManagementState } from '../../shared/state/user-management.state';
import { UserModalService } from '../../shared/services/user-modal.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let store: any;
  let modalService: UserModalService;

  const users = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@t.com',
      username: 'jd',
      role: 'admin',
      isBlocked: false,
    },
  ];

  beforeEach(async () => {
    const mockStore = {
      loadUsers: vi.fn(),
      loadUserDetails: vi.fn(),
      clearSelectedUser: vi.fn(),
      deleteUser: vi.fn(),
      toggleBlockStatus: vi.fn(),
      updateUser: vi.fn(),
      users: signal(users),
      selectedUser: signal({ id: '1', firstName: 'John' }),
      loading: signal(false),
      actionLoading: signal(false),
      error: signal(null),
      processingIds: signal([]),
      userCache: signal({}),
    };

    await TestBed.configureTestingModule({ imports: [UserManagementComponent] })
      .overrideComponent(UserManagementComponent, {
        set: {
          providers: [
            { provide: UserManagementStore, useValue: mockStore },
            {
              provide: UserManagementState,
              useValue: { newConfig: signal({}) },
            },
            UserModalService,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(UserManagementStore);
    modalService = fixture.debugElement.injector.get(UserModalService);
    fixture.detectChanges();
  });

  it('should create and load users', () => {
    expect(component).toBeTruthy();
    expect(store.loadUsers).toHaveBeenCalled();
  });

  it('should handle modals', () => {
    component.details('1');
    expect(modalService.modalState()).toBe('details');
    expect(store.clearSelectedUser).toHaveBeenCalled();
    component.onEdit('1');
    expect(modalService.modalState()).toBe('edit');
    component.deleteUser('1');
    expect(modalService.modalState()).toBe('delete');
    component.onCloseModal();
    expect(modalService.modalState()).toBe('none');
  });

  it('should handle search and pagination', () => {
    component.onSearch('test');
    component.onPageChange(2);
    expect(component['pagination'].currentPage()).toBe(2);
    component.onSearch(null);
    component.onSearch('');
  });

  it('should handle actions', () => {
    component.onUpdateUser({ firstName: 'New' } as any);
    expect(store.updateUser).toHaveBeenCalled();
    expect(component['isSaving']()).toBe(true);
    store.selectedUser.set(null);
    component.onUpdateUser({} as any);
    modalService.openDelete('1');
    component.onConfirmDelete();
    expect(store.deleteUser).toHaveBeenCalledWith('1');
    modalService.close();
    component.onConfirmDelete();
    component.block('1', false);
    expect(store.toggleBlockStatus).toHaveBeenCalledWith({
      id: '1',
      isBlocked: true,
    });
  });

  it('should handle effects', async () => {
    modalService.openDelete('1');
    store.users.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalService.modalState()).toBe('none');
    component['isSaving'].set(true);
    store.actionLoading.set(false);
    store.error.set(null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component['isSaving']()).toBe(false);
    component['isSaving'].set(true);
    store.error.set('error');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component['isSaving']()).toBe(false);
  });
});
