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
  let mockStore: any;
  let modalService: UserModalService;

  beforeEach(async () => {
    mockStore = {
      loadUsers: vi.fn(),
      loadUserDetails: vi.fn(),
      clearSelectedUser: vi.fn(),
      deleteUser: vi.fn(),
      toggleBlockStatus: vi.fn(),
      users: signal(
        Array.from({ length: 5 }, (_, i) => ({
          id: `${i}`,
          firstName: `U${i}`,
          isBlocked: false,
        })),
      ),
      selectedUser: signal(null),
      loading: signal(false),
      actionLoading: signal(false),
      error: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
    })
      .overrideComponent(UserManagementComponent, {
        set: {
          providers: [
            { provide: UserManagementStore, useValue: mockStore },
            {
              provide: UserManagementState,
              useValue: {
                newConfig: signal({
                  searchInput: { placeholder: 'Search...' },
                }),
              },
            },
            UserModalService,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    modalService = fixture.debugElement.injector.get(UserModalService);
    fixture.detectChanges();
  });

  it('should load users and handle pagination', () => {
    expect(mockStore.loadUsers).toHaveBeenCalled();
    expect(component['pagination'].totalPages()).toBe(2);
    expect(component['pagination'].visibleItems().length).toBe(4);
    component.onPageChange(2);
    expect(component['pagination'].currentPage()).toBe(2);
    expect(component['pagination'].visibleItems().length).toBe(1);
  });

  it('should handle details modal', () => {
    component.details('1');
    expect(modalService.modalState()).toBe('details');
    expect(mockStore.loadUserDetails).toHaveBeenCalledWith('1');
    expect(mockStore.clearSelectedUser).toHaveBeenCalled();
  });

  it('should handle delete modal and confirm', () => {
    component.deleteUser('123');
    expect(modalService.userToDeleteId()).toBe('123');
    expect(modalService.modalState()).toBe('delete');
    component.onConfirmDelete();
    expect(mockStore.deleteUser).toHaveBeenCalledWith('123');
  });

  it('should handle block toggle', () => {
    component.block('1', false);
    expect(component['actionProcessingId']()).toBe('1');
    expect(mockStore.toggleBlockStatus).toHaveBeenCalledWith({
      id: '1',
      isBlocked: true,
    });
  });

  it('should close modal and clear state', () => {
    component.deleteUser('1');
    component.onCloseModal();
    expect(modalService.modalState()).toBe('none');
    expect(mockStore.clearSelectedUser).toHaveBeenCalled();
  });
});
