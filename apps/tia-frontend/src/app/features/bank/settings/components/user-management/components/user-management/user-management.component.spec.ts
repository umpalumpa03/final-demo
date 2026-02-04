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

  beforeEach(async () => {
    const mockStore = {
      loadUsers: vi.fn(),
      loadUserDetails: vi.fn(),
      clearSelectedUser: vi.fn(),
      deleteUser: vi.fn(),
      toggleBlockStatus: vi.fn(),
      updateUser: vi.fn(),
      users: signal([{ id: '1', firstName: 'U1', isBlocked: false }]),
      selectedUser: signal({ id: '1', firstName: 'John' }),
      loading: signal(false),
      actionLoading: signal(false),
      error: signal(null),
    };

    const mockState = {
      newConfig: signal({ searchInput: { placeholder: 'Search...' } }),
    };

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [],
    })
      .overrideComponent(UserManagementComponent, {
        set: {
          providers: [
            { provide: UserManagementStore, useValue: mockStore },
            { provide: UserManagementState, useValue: mockState },
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

  it('should initialize and handle pagination', () => {
    expect(store.loadUsers).toHaveBeenCalled();

    expect(component['pagination'].currentPage()).toBe(1);
    component.onPageChange(2);
    expect(component['pagination'].currentPage()).toBe(2);
  });

  it('should open modals via service', () => {
    component.details('1');
    expect(store.clearSelectedUser).toHaveBeenCalled();
    expect(store.loadUserDetails).toHaveBeenCalledWith('1');
    expect(modalService.modalState()).toBe('details');

    component.onEdit('1');
    expect(modalService.modalState()).toBe('edit');

    component.deleteUser('1');
    expect(modalService.modalState()).toBe('delete');
  });

  it('should handle actions (Update, Delete, Block)', () => {
    modalService.openEdit();
    component.onUpdateUser({ firstName: 'New' } as any);
    expect(store.updateUser).toHaveBeenCalled();
    expect(store.loadUsers).toHaveBeenCalledTimes(2);
    expect(modalService.modalState()).toBe('none');

    modalService.openDelete('1');
    component.onConfirmDelete();
    expect(store.deleteUser).toHaveBeenCalledWith('1');

    component.block('1', false);
    expect(store.toggleBlockStatus).toHaveBeenCalledWith({
      id: '1',
      isBlocked: true,
    });
    expect(component['actionProcessingId']()).toBe('1');
  });

  it('should auto-close modal when user is removed', async () => {
    component.deleteUser('1');
    fixture.detectChanges();
    expect(modalService.modalState()).toBe('delete');

    store.users.set([]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(modalService.modalState()).toBe('none');
  });
});
