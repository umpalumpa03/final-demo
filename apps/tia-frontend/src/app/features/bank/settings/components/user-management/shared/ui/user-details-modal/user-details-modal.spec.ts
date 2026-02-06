import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsModal } from './user-details-modal';
import { IUserDetail } from '../../models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserDetailsModal', () => {
  let component: UserDetailsModal;
  let fixture: ComponentFixture<UserDetailsModal>;

  const mockUser: IUserDetail = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    username: 'johnd',
    role: 'CONSUMER',
    isBlocked: false,
    pId: '123',
    phone: '555',
    phoneVerifiedAt: '',
    avatar: 'string',
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('userData', mockUser);
    fixture.componentRef.setInput('isOpen', true);

    fixture.detectChanges();
  });

  it('should create and render user data', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('John Doe');
  });

  it('should handle getInitials', () => {
    expect(component.getInitials('John', 'Doe')).toBe('JD');
    expect(component.getInitials('', '')).toBe('');
    expect(component.getInitials('A', 'B')).toBe('AB');
  });
});
