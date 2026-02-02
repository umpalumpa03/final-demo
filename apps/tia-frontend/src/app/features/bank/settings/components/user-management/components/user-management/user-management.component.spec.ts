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
  let mockState: any;

  beforeEach(async () => {
    mockStore = {
      loadUsers: vi.fn(),
      users: signal(
        Array.from({ length: 5 }, (_, i) => ({
          id: `${i}`,
          firstName: `User ${i}`,
        })),
      ),
    };

    mockState = {
      newConfig: signal({
        searchInput: { placeholder: 'Search...' },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
    })
      .overrideComponent(UserManagementComponent, {
        set: {
          providers: [
            { provide: UserManagementStore, useValue: mockStore },
            { provide: UserManagementState, useValue: mockState },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and load users', () => {
    expect(component).toBeTruthy();
    expect(mockStore.loadUsers).toHaveBeenCalled();
  });

  it('should handle pagination logic correctly', () => {
    expect(component['totalPages']()).toBe(2);
    expect(component['visibleUsers']().length).toBe(4);
    expect(component['visibleUsers']()[0].id).toBe('0');

    component.onPageChange(2);
    fixture.detectChanges();

    expect(component['currentPage']()).toBe(2);
    expect(component['visibleUsers']().length).toBe(1);
    expect(component['visibleUsers']()[0].id).toBe('4');
  });
});
