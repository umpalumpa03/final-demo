import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { ForgotPasswordVerify } from './forgot-password-verify';
import { IVerified } from '../../../../otp-verification/models/otp-verification.models';
import { Routes } from '../../../models/tokens.model';

describe('ForgotPasswordVerify', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  let authServiceMock: {
    getChallengeId: ReturnType<typeof vi.fn>;
    verifyForgotPasswordOtp: ReturnType<typeof vi.fn>;
    resendVerificationCode: ReturnType<typeof vi.fn>;
  };
  let tokenServiceMock: {
    clearAllToken: ReturnType<typeof vi.fn>;
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
    tokenServiceMock = {
      clearAllToken: vi.fn(),
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
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}), queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit should redirect to forgot-password base route when challengeId is missing', () => {
    authServiceMock.getChallengeId.mockReturnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth', 'forgot-password']);
  });

  it('verifyResetOtp should verify OTP and navigate on success, set error on failure, and skip when not called', () => {
    const skipEvent: IVerified = { isCalled: false, otp: '123456' };
    component.verifyResetOtp(skipEvent);
    expect(authServiceMock.verifyForgotPasswordOtp).not.toHaveBeenCalled();

    const successEvent: IVerified = { isCalled: true, otp: '123456' };
    component.verifyResetOtp(successEvent);
    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith('123456');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth', 'reset-password']);

    authServiceMock.verifyForgotPasswordOtp.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Invalid code' } })),
    );
    component.verifyResetOtp({ isCalled: true, otp: 'wrong' });
    expect(component.errorMessage()).toBe('Invalid code');
  });

  it('onOtpInputChanged should clear errorMessage when it exists', () => {
    component.errorMessage.set('Invalid code');
    component.onOtpInputChanged();
    expect(component.errorMessage()).toBeNull();
  });

  it('resendOtp should call resendVerificationCode only when isCalled is true', () => {
    component.resendOtp(true);
    expect(authServiceMock.resendVerificationCode).toHaveBeenCalled();

    authServiceMock.resendVerificationCode.mockClear();
    component.resendOtp(false);
    expect(authServiceMock.resendVerificationCode).not.toHaveBeenCalled();
  });

  it('clearedBackout should clear all tokens and navigate to sign-in', () => {
    component.clearedBackout();
    expect(tokenServiceMock.clearAllToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });
});
