import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySignup } from './verify-signup';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IVerified } from '../../../models/otp-verification.models';

describe('VerifySignup Component', () => {
  let component: VerifySignup;
  let fixture: ComponentFixture<VerifySignup>;
  let authServiceMock: {
    verifyPhoneOtpCode: ReturnType<typeof vi.fn>;
    resetPhoneOtp: ReturnType<typeof vi.fn>;
    resendPhoneOtp: ReturnType<typeof vi.fn>;
    otpError: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    authServiceMock = {
      verifyPhoneOtpCode: vi.fn().mockReturnValue(of({})),
      resetPhoneOtp: vi.fn().mockReturnValue(of({})),
      resendPhoneOtp: vi.fn().mockReturnValue(of({})),
      otpError: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [VerifySignup, TranslateModule.forRoot()],
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

    fixture = TestBed.createComponent(VerifySignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not verify phone OTP when isCalled is false', () => {
    const event: IVerified = {
      isCalled: false,
      otp: '123456',
    };

    component.verifyRegisterOtp(event);

    expect(authServiceMock.verifyPhoneOtpCode).not.toHaveBeenCalled();
  });

  it('should resend OTP when isCalled is true', () => {
    component.resendOtp(true);

    expect(authServiceMock.resendPhoneOtp).toHaveBeenCalled();
  });
});