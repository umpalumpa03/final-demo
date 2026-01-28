import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;
  let authServiceMock: {
    verifyMfa: ReturnType<typeof vi.fn>;
    getChallengeId: ReturnType<typeof vi.fn>;
    isLoginLoading: ReturnType<typeof signal>;
    verifyOtpCode: ReturnType<typeof vi.fn>;
    verifyForgotPasswordOtp: ReturnType<typeof vi.fn>;
  };
  let authService: AuthService;
  let router: Router;

  const createComponent = (path: 'sign-in' | 'sign-up') => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { url: [{ path }], data: {} } }
    });

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  };

  beforeEach(async () => {
    authServiceMock = {
      verifyMfa: vi.fn().mockReturnValue(of({})),
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      isLoginLoading: signal(false),
      verifyOtpCode: vi.fn().mockReturnValue(of({ success: true })),
      verifyForgotPasswordOtp: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [OtpVerification],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: {} },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { url: [{ path: 'sign-in' }], data: {} } },
        },
      ],
    }).compileComponents();
  });

  it('should initialize with sign-in logic when path is sign-in', () => {
    createComponent('sign-in');
    expect(component['registerVerifyLogic']()).toBe(false);
  });

  it('should initialize with sign-up logic when path is sign-up', () => {
    createComponent('sign-up');
    expect(component['registerVerifyLogic']()).toBe(true);
  });

  it('should not call API and mark form touched if verificationCode is invalid', () => {
    createComponent('sign-up');
    const authSpy = vi.spyOn(authService, 'verifyOtpCode');
    
    component.submit();

    expect(component.smsCodeVerificationForm.touched).toBe(true);
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('should navigate to success page on successful verification', () => {
    createComponent('sign-up');
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(authService, 'verifyOtpCode').mockReturnValue(of({ success: true } as any));

    component.smsCodeVerificationForm.controls.verificationCode.setValue('1234');
    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/success']);
  });

  it('should set OTP required error when submitReset has no value', () => {
    createComponent('sign-up');

    component.submitReset();

    expect(component.otpError()).toBe('OTP is required');
    expect(authServiceMock.verifyForgotPasswordOtp).not.toHaveBeenCalled();
  });

  it('should set OTP length error when submitReset has short value', () => {
    createComponent('sign-up');

    component.form.controls.otp.setValue('12');
    component.submitReset();

    expect(component.otpError()).toBe('OTP must be 4 digits');
    expect(authServiceMock.verifyForgotPasswordOtp).not.toHaveBeenCalled();
  });

  it('should navigate on successful submitReset', () => {
    createComponent('sign-up');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.controls.otp.setValue('1234');
    component.submitReset();

    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith('1234');
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/reset-password']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set error message on failed submitReset', () => {
    createComponent('sign-up');
    vi.spyOn(authService, 'verifyForgotPasswordOtp').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );

    component.form.controls.otp.setValue('1234');
    component.submitReset();

    expect(component.otpError()).toBe('Invalid OTP code');
    expect(component.isSubmitting()).toBe(false);
  });
});