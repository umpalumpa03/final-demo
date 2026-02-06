import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordVerify } from './forgot-password-verify';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { IVerified } from '../../../models/otp-verification.models';

describe('ForgotPasswordVerify', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  let authServiceMock: {
    getChallengeId: ReturnType<typeof vi.fn>;
    verifyForgotPasswordOtp: ReturnType<typeof vi.fn>;
    resendVerificationCode: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      verifyForgotPasswordOtp: vi.fn().mockReturnValue(of({})),
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
    };
    routerMock = {
      navigate: vi.fn(),
    };
    @Component({ selector: 'app-otp-verification', standalone: true, template: '' })
    class OtpVerificationStub {
      @Input() errorMessage: any;
      @Output() isVerifyCalled = new EventEmitter<any>();
      @Output() isResendCalled = new EventEmitter<any>();
      @Output() onTimeout = new EventEmitter<void>();
    }

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify, OtpVerificationStub, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {}, params: of({}), queryParams: of({}) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Feature: redirects to forgot-password base route when challengeId is missing', () => {
    authServiceMock.getChallengeId.mockReturnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth', 'forgot-password']);
  });

  it('Feature: verifyResetOtp does nothing when isCalled=false', () => {
    const event: IVerified = { isCalled: false, otp: '123456' };
    component.verifyResetOtp(event);
    expect(authServiceMock.verifyForgotPasswordOtp).not.toHaveBeenCalled();
  });

  it('Feature: verifyResetOtp verifies otp and navigates to reset route on success', () => {
    const event: IVerified = { isCalled: true, otp: '123456' };
    component.verifyResetOtp(event);
    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith('123456');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth', 'reset-password']);
    expect(component.errorMessage()).toBeNull();
  });

  it('Feature: verifyResetOtp sets errorMessage when API returns an error', () => {
    authServiceMock.verifyForgotPasswordOtp.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Invalid code' } })),
    );
    const event: IVerified = { isCalled: true, otp: 'wrong' };
    component.verifyResetOtp(event);
    expect(component.errorMessage()).toBe('Invalid code');
  });

  it('Feature: onOtpInputChanged clears errorMessage if it exists', () => {
    component.errorMessage.set('Invalid code');
    component.onOtpInputChanged();
    expect(component.errorMessage()).toBeNull();
  });

  it('Feature: resendOtp calls resendVerificationCode when isCalled=true', () => {
    component.resendOtp(true);
    expect(authServiceMock.resendVerificationCode).toHaveBeenCalled();
  });
});
