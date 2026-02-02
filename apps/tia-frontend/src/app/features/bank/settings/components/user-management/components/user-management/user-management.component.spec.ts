import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { UserManagementStore } from '../../store/user-management.store';
import { UserManagementState } from '../../shared/state/user-management.state';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      loadUsers: vi.fn(),
      loadUserDetails: vi.fn(),
      clearSelectedUser: vi.fn(),
      deleteUser: vi.fn(),
      users: signal(
        Array.from({ length: 5 }, (_, i) => ({
          id: `${i}`,
          firstName: `U${i}`,
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
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load users and compute pagination', () => {
    expect(mockStore.loadUsers).toHaveBeenCalled();
    expect(component['totalPages']()).toBe(2);
    expect(component['visibleUsers']().length).toBe(4);
    component.onPageChange(2);
    expect(component['visibleUsers']().length).toBe(1);
  });

  it('should handle modal states', () => {
    component.details('1');
    expect(component['modalState']()).toBe('details');
    expect(mockStore.loadUserDetails).toHaveBeenCalledWith('1');

    component.deleteUser('99');
    expect(component['modalState']()).toBe('delete');

    component.onCloseModal();
    expect(component['modalState']()).toBe('none');
  });

  it('should delete user', () => {
    component.deleteUser('123');
    component.onConfirmDelete();
    expect(mockStore.deleteUser).toHaveBeenCalledWith('123');
  });

  it('should auto-close on user removal', async () => {
    component.deleteUser('0');
    mockStore.users.set(
      Array.from({ length: 4 }, (_, i) => ({
        id: `${i + 1}`,
        firstName: `U${i + 1}`,
      })),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component['modalState']()).toBe('none');
  });
});
