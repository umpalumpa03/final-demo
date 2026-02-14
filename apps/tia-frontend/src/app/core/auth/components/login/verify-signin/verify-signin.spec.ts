import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySignin } from './verify-signin';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IVerified } from '../../../../otp-verification/models/otp-verification.models';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';

describe('VerifySignin Component', () => {
  let component: VerifySignin;
  let fixture: ComponentFixture<VerifySignin>;
  let authServiceMock: {
    getChallengeId: ReturnType<typeof vi.fn>;
    verifyMfa: ReturnType<typeof vi.fn>;
    resendVerificationCode: ReturnType<typeof vi.fn>;
    otpError: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    authServiceMock = {
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      verifyMfa: vi.fn().mockReturnValue(of({})),
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
      otpError: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [VerifySignin, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
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
    const event: IVerified = {
      isCalled: true,
      otp: '123456',
    };

    const expectedPayload: IMfaVerifyRequest = {
      code: '123456',
      challengeId: 'challenge-123',
    };

    component.verifyOtp(event);

    expect(authServiceMock.getChallengeId).toHaveBeenCalled();
    expect(authServiceMock.verifyMfa).toHaveBeenCalledWith(expectedPayload);
  });

  it('should not verify MFA when isCalled is false', () => {
    const event: IVerified = {
      isCalled: false,
      otp: '123456',
    };

    component.verifyOtp(event);

    expect(authServiceMock.verifyMfa).not.toHaveBeenCalled();
  });

  it('should resend verification code when isCalled is true', () => {
    component.resendOtp(true);

    expect(authServiceMock.resendVerificationCode).toHaveBeenCalled();
  });

  it('should not resend verification code when isCalled is false', () => {
    component.resendOtp(false);

    expect(authServiceMock.resendVerificationCode).not.toHaveBeenCalled();
  });
});