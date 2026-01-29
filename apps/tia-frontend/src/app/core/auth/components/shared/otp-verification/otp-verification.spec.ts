import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../services/auth.service';
import { signal } from '@angular/core';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let authServiceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    authServiceMock = {
      isLoginLoading: signal(false),
      getChallengeId: vi.fn().mockReturnValue('mock-id'),
      verifyMfa: vi.fn().mockReturnValue(of({})),
      verifyOtpCode: vi.fn().mockReturnValue(of({})),
      verifyForgotPasswordOtp: vi.fn().mockReturnValue(of({})),
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    routeMock = {
      snapshot: {
        data: {},
        url: [{ path: 'sign-up' }],
      },
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OtpVerification],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    component = TestBed.createComponent(OtpVerification).componentInstance;
  });

  it('should initialize with sign-up context based on route', () => {
    // Context is private, but we can verify behavior via submit()
    component.smsCodeVerificationForm.controls.verificationCode.setValue('1234');
    component.submit();
    expect(authServiceMock.verifyOtpCode).toHaveBeenCalledWith('1234');
  });

  it('should initialize with forgot-password context from route data', () => {
    routeMock.snapshot.data['otpContext'] = 'forgot-password';
    
    component.smsCodeVerificationForm.controls.verificationCode.setValue('1234');
    component.submit();
    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith('1234');
  });

  describe('verifyOtp (MFA path)', () => {
    it('should call verifyMfa with form values and challengeId', () => {
      component.otpForm.controls.code.setValue('9999');
      component.verifyOtp();

      expect(authServiceMock.verifyMfa).toHaveBeenCalledWith({
        code: '9999',
        challengeId: 'mock-id'
      });
    });
  });

  describe('registerVerification (Sign-up path)', () => {
    it('should navigate to success on valid OTP', () => {
      routeMock.snapshot.url = [{ path: 'sign-up' }];
      
      component.smsCodeVerificationForm.controls.verificationCode.setValue('1234');
      component.submit();

      expect(authServiceMock.verifyOtpCode).toHaveBeenCalledWith('1234');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/success']);
    });

    it('should set errorMessage on API failure', () => {
      const errorResponse = { error: { message: 'Invalid Code' } };
      authServiceMock.verifyOtpCode.mockReturnValue(throwError(() => errorResponse));
      
      component.smsCodeVerificationForm.controls.verificationCode.setValue('1111');
      component.submit();

      expect(component.errorMessage()).toBe('Invalid Code');
    });
  });

  describe('submitReset (Reset Password path)', () => {
    it('should set error if OTP is too short', () => {
      component.form.controls.otp.setValue('12');
      component.submitReset();
      expect(component.otpError()).toBe('OTP must be 4 digits');
    });

    it('should navigate to reset-password on success', () => {
      component.form.controls.otp.setValue('1234');
      component.submitReset();

      expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith('1234');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/reset-password']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle 400 error specifically', () => {
      const error = { status: 400 };
      authServiceMock.verifyForgotPasswordOtp.mockReturnValue(throwError(() => error));
      
      component.form.controls.otp.setValue('1234');
      component.submitReset();

      expect(component.otpError()).toBe('Invalid OTP code');
    });
  });

  it('should call resendVerificationCode when resend is triggered', () => {
    component.resendVerification();
    expect(authServiceMock.resendVerificationCode).toHaveBeenCalled();
  });

  it('should navigate back to phone page', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['auth/phone']);
  });
});