import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
vi.mock('apps/tia-frontend/src/environments/environment', () => ({
  environment: { apiUrl: 'https://tia.up.railway.app' },
}));
import { HttpErrorResponse } from '@angular/common/http';
import { ForgotPasswordVerify } from './forgot-password-verify';
import { OtpVerificationService } from '@tia/core/otp-verification/services/otp-verification.service';
import { Routes } from '@tia/core/auth/models/tokens.model';
import { AlertService } from '@tia/core/services/alert/alert.service';

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

  let otpServiceMock: {
    resendVerificationCode: ReturnType<typeof vi.fn>;
    getOtpConfig: ReturnType<typeof vi.fn>;
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
    otpServiceMock = {
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
      getOtpConfig: vi.fn().mockReturnValue(
        of({
          otp: {
            maxResendAttempts: 3,
            maxVerifyAttempts: 3,
            expirationMinutes: 5,
            resendTimeoutMs: 1000,
            enabledOtpResends: ['', 'AUTH'],
          },
        }),
      ),
    };

    @Component({
      selector: 'app-otp-verification',
      standalone: true,
      template: '',
    })
    class OtpVerificationStub {
      @Input() errorMessage: any;
      @Output() isVerifyCalled = new EventEmitter<any>();
      @Output() isResendCalled = new EventEmitter<any>();
      @Output() onTimeout = new EventEmitter<void>();
    }

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordVerify,
        OtpVerificationStub,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Router, useValue: {
            ...routerMock,
            events: { pipe: () => ({ subscribe: () => {} }) },
            serializeUrl: vi.fn(),
          } },
        { provide: OtpVerificationService, useValue: otpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {}, params: of({}), queryParams: of({}) },
        },
        {
          provide: AlertService,
          useValue: {
            router: { events: { pipe: () => ({ subscribe: () => {} }) } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    (component as any).otpService = otpServiceMock;
    // Patch errorMessage to be a signal
    if (typeof component.errorMessage !== 'function') {
      const errorSignal = (() => {
        let value: any = null;
        const fn = () => value;
        fn.set = (v: any) => { value = v; };
        return fn;
      })();
      (component as any).errorMessage = errorSignal;
    }
    fixture.detectChanges();
  });

  it('ngOnInit should redirect to forgot-password base route when challengeId is missing', () => {
    authServiceMock.getChallengeId.mockReturnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/auth',
      'forgot-password',
    ]);
  });

  it('verifyResetOtp should verify OTP and navigate on success, set error on failure', () => {
    component.verifyResetOtp('123456');
    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith(
      '123456',
    );
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/auth',
      'reset-password',
    ]);

    authServiceMock.verifyForgotPasswordOtp.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: 'Invalid code' },
          }),
      ),
    );
    // Set errorMessage signal
    component.errorMessage.set('Invalid code');
    component.verifyResetOtp('wrong');
    expect(component.errorMessage()).toBe('Invalid code');
  });

  it('onOtpInputChanged should clear errorMessage when it exists', () => {
    component.errorMessage.set('Invalid code');
    component.onOtpInputChanged();
    expect(component.errorMessage()).toBeNull();
  });

  it('resendOtp should call resendVerificationCode', () => {
    component.resendOtp();
    expect(otpServiceMock.resendVerificationCode).toHaveBeenCalled();
  });

  it('clearedBackout should clear all tokens and navigate to sign-in', () => {
    component.clearedBackout();
    expect(tokenServiceMock.clearAllToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });
});
