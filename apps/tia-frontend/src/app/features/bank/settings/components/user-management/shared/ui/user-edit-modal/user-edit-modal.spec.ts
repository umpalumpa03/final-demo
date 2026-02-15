import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditModal } from './user-edit-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IUserDetail } from '../../models/users.model';

describe('UserEditModal', () => {
  let component: UserEditModal;
  let fixture: ComponentFixture<UserEditModal>;

  const mockUser: IUserDetail = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CONSUMER',
    email: 'j@d.com',
    isBlocked: false,
    createdAt: '2023-01-01',
    phoneVerifiedAt: '2023-01-01',
    pId: '12345678901',
    phone: '555123456',
    username: 'johndoe',
    avatar: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditModal, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('userData', null);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Effect: userData updates', () => {
    it('should patch form values when userData is provided', async () => {
      fixture.componentRef.setInput('userData', mockUser);

      fixture.detectChanges();

      expect(component.form.controls.firstName.value).toBe(mockUser.firstName);
      expect(component.form.controls.lastName.value).toBe(mockUser.lastName);
      expect(component.form.controls.pId.value).toBe(mockUser.pId);
      expect(component.form.controls.role.value).toBe(mockUser.role);
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Validation: pId', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('userData', mockUser);
      fixture.detectChanges();
    });

    it('should be valid if pId is exactly 11 characters', () => {
      component.form.patchValue({ pId: '11122233344' });
      expect(component.form.controls.pId.valid).toBe(true);
    });
  });

  describe('onSave', () => {
    it('should emit save event with raw values when form is valid', () => {
      const emitSpy = vi.spyOn(component.save, 'emit');

      fixture.componentRef.setInput('userData', mockUser);
      fixture.detectChanges();

      component.onSave();

      expect(emitSpy).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        pId: '12345678901',
        role: 'CONSUMER',
      });
    });
  });
});
