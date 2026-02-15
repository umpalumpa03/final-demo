import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySignin } from './verify-signin';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('apps/tia-frontend/src/environments/environment', () => ({ environment: { apiUrl: 'https://tia.up.railway.app' } }));
import { OtpVerificationService } from '@tia/core/otp-verification/services/otp-verification.service';
import { IMfaVerifyRequest } from '@tia/core/auth/models/authRequest.models';

describe('VerifySignin Component', () => {
  let component: VerifySignin;
  let fixture: ComponentFixture<VerifySignin>;
  let authServiceMock: {
    getChallengeId: ReturnType<typeof vi.fn>;
    verifyMfa: ReturnType<typeof vi.fn>;
    resendVerificationCode: ReturnType<typeof vi.fn>;
    otpError: ReturnType<typeof signal>;
  };

  let otpServiceMock: {
    resendVerificationCode: ReturnType<typeof vi.fn>;
    getOtpConfig: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      verifyMfa: vi.fn().mockReturnValue(of({})),
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
      otpError: signal(null),
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

    await TestBed.configureTestingModule({
      imports: [VerifySignin, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: OtpVerificationService, useValue: otpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} },
          },
        },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should verify MFA with correct payload when isCalled is true', () => {

    const expectedPayload: IMfaVerifyRequest = {
      code: '123456',
      challengeId: 'challenge-123',
    };

    component.verifyOtp('123456');

    expect(authServiceMock.getChallengeId).toHaveBeenCalled();
    expect(authServiceMock.verifyMfa).toHaveBeenCalledWith({ challengeId: 'challenge-123', code: '123456' });
  });

  it('should verify MFA when called', () => {
    component.verifyOtp('123456');

    expect(authServiceMock.getChallengeId).toHaveBeenCalled();
    expect(authServiceMock.verifyMfa).toHaveBeenCalledWith({ challengeId: 'challenge-123', code: '123456' });
  });

  it('should resend verification code', () => {
    component.resendOtp();

    expect(otpServiceMock.resendVerificationCode).toHaveBeenCalled();
  });

  it('should resend verification code', () => {
    component.resendOtp();

    expect(otpServiceMock.resendVerificationCode).toHaveBeenCalled();
  });
});