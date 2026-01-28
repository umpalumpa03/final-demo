import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PhoneVerification } from './phone-verification';
import { AuthService } from '../../../services/auth.service';

describe('PhoneVerification', () => {
  let component: PhoneVerification;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      sendPhoneVerificationCode: vi.fn(),
      setChellangeId: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PhoneVerification],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    component = TestBed.createComponent(PhoneVerification).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty phone number and invalid form', () => {
    expect(component.setPhoneNumberForm.getRawValue().phoneNumber).toBe('');
    expect(component.setPhoneNumberForm.valid).toBe(false);
  });

  it('should be valid when a phone number is entered', () => {
    component.setPhoneNumberForm.controls.phoneNumber.setValue('555123456');
    expect(component.setPhoneNumberForm.valid).toBe(true);
  });

  describe('submit()', () => {
    it('should navigate and set challengeId on successful API call', () => {
      const mockResponse = { challengeId: 'mock-challenge-123' };
      authServiceMock.sendPhoneVerificationCode.mockReturnValue(of(mockResponse));
      
      component.setPhoneNumberForm.controls.phoneNumber.setValue('555123456');
      component.submit();

      expect(authServiceMock.sendPhoneVerificationCode).toHaveBeenCalledWith('555123456');
      expect(authServiceMock.setChellangeId).toHaveBeenCalledWith('mock-challenge-123');
      expect(component.errorMessage()).toBe('');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/otp']);
    });

    it('should set errorMessage signal when API call fails', () => {
      const errorResponse = {
        error: { message: 'Invalid phone number format' }
      };
      authServiceMock.sendPhoneVerificationCode.mockReturnValue(throwError(() => errorResponse));

      component.setPhoneNumberForm.controls.phoneNumber.setValue('wrong-number');
      component.submit();

      expect(authServiceMock.sendPhoneVerificationCode).toHaveBeenCalled();
      expect(component.errorMessage()).toBe('Invalid phone number format');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should set error message from backend even if message property is nested', () => {
      const errorResponse = { error: { message: 'User already exists' } };
      authServiceMock.sendPhoneVerificationCode.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(component.errorMessage()).toBe('User already exists');
    });
  });
});