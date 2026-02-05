import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { VerifySignup } from './verify-signup';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../../../models/tokens.model';

describe('VerifySignup', () => {
  let component: VerifySignup;

  beforeEach(() => {
    const authMock = {
      otpError: { set: vi.fn(), subscribe: vi.fn() },
      verifyPhoneOtpCode: vi.fn(() => of({})),
      resendPhoneOtp: vi.fn(() => of({})),
    };

    const tokenMock = { clearAllToken: vi.fn() };
    const routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: TokenService, useValue: tokenMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.runInInjectionContext(() => new VerifySignup());
  });

  it('calls verifyPhoneOtpCode when event.isCalled is true', () => {
    const auth = TestBed.inject(AuthService) as any;
    component.verifyRegisterOtp({ isCalled: true, otp: '123' } as any);
    expect(auth.verifyPhoneOtpCode).toHaveBeenCalledWith('123');
  });

  it('does not call verifyPhoneOtpCode when event.isCalled is false', () => {
    const auth = TestBed.inject(AuthService) as any;
    component.verifyRegisterOtp({ isCalled: false } as any);
    expect(auth.verifyPhoneOtpCode).not.toHaveBeenCalled();
  });

  it('resends otp when called', () => {
    const auth = TestBed.inject(AuthService) as any;
    component.resendOtp(true);
    expect(auth.resendPhoneOtp).toHaveBeenCalled();
  });

  it('clearedBackout clears tokens and navigates', () => {
    const token = TestBed.inject(TokenService) as any;
    const router = TestBed.inject(Router) as any;
    component.clearedBackout();
    expect(token.clearAllToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });
});
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