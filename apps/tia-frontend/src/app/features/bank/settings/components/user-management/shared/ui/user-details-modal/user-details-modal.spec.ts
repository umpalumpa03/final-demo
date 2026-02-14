import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsModal } from './user-details-modal';
import { IUserDetail } from '../../models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailsConfigService } from '../../config/user-details.config';
import { By } from '@angular/platform-browser';

describe('UserDetailsModal', () => {
  let component: UserDetailsModal;
  let fixture: ComponentFixture<UserDetailsModal>;

  const mockUser: IUserDetail & { avatarUrl?: string } = {
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
    avatarUrl: 'https://example.com/img.jpg',
    createdAt: new Date().toISOString(),
  };

  const mockConfigService = {
    getConfig: vi.fn().mockReturnValue([
      { label: 'Username', value: 'johnd', type: 'text' },
      { label: 'Created', value: '2026-01-01', type: 'date' },
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsModal, TranslateModule.forRoot()],
      providers: [
        { provide: UserDetailsConfigService, useValue: mockConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('userData', mockUser);
    fixture.componentRef.setInput('isOpen', true);

    fixture.detectChanges();
  });

  it('should create and render basic user info', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('john@test.com');

    expect(mockConfigService.getConfig).toHaveBeenCalled();
  });

  it('should show loader and hide content when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('.loader-container'));
    const mainContent = fixture.debugElement.query(By.css('.main__icon'));

    expect(loader).toBeTruthy();
    expect(mainContent).toBeNull();
  });

  it('should emit close event when footer button is clicked', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');

    const button = fixture.debugElement.query(By.css('footer app-button'));
    button.triggerEventHandler('click', null);

    expect(closeSpy).toHaveBeenCalled();
  });

  describe('getInitials()', () => {
    it('should format first and last name correctly', () => {
      expect(component.getInitials('Alice', 'Wonderland')).toBe('A.W');
    });

    it('should handle lower case names', () => {
      expect(component.getInitials('bob', 'builder')).toBe('B.B');
    });

    it('should handle empty or missing strings gracefully', () => {
      expect(component.getInitials('', '')).toBe('.');
    });
  });

  describe('asDate()', () => {
    it('should return the value passed to it (type helper)', () => {
      const dateStr = '2024-01-01';
      expect(component.asDate(dateStr)).toBe(dateStr);
      expect(component.asDate(123456789)).toBe(123456789);
    });
  });
});
