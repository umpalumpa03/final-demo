import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditModal } from './user-edit-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserEditModal', () => {
  let component: UserEditModal;
  let fixture: ComponentFixture<UserEditModal>;

  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CONSUMER',
    email: 'j@d.com',
    isBlocked: false,
    createdAt: '',
    pId: '',
    phone: '',
    phoneVerifiedAt: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userData', null);
    fixture.detectChanges();
  });

  it('should create and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.form.value).toEqual({
      firstName: null,
      lastName: null,
      role: null,
    });
  });

  it('should patch form when userData provided', () => {
    fixture.componentRef.setInput('userData', mockUser);
    fixture.detectChanges();
    expect(component.form.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      role: 'CONSUMER',
    });
  });

  it('should reset form when userData is null', () => {
    fixture.componentRef.setInput('userData', mockUser);
    fixture.detectChanges();
    fixture.componentRef.setInput('userData', null);
    fixture.detectChanges();
    expect(component.form.value).toEqual({
      firstName: null,
      lastName: null,
      role: null,
    });
  });

  it('should not emit when form is invalid', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.onSave();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit when form is valid', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.form.patchValue({
      firstName: 'A',
      lastName: 'B',
      role: 'SUPPORT',
    });
    component.onSave();
    expect(emitSpy).toHaveBeenCalledWith({
      firstName: 'A',
      lastName: 'B',
      role: 'SUPPORT',
    });
  });
});
