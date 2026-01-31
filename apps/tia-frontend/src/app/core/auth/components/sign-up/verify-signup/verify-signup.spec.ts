import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { VerifySignup } from './verify-signup';
import { AuthService } from '../../../services/auth.service';

describe('VerifySignup', () => {
  let component: VerifySignup;
  let authMock: any;

  beforeEach(async () => {
    authMock = { verifyPhoneOtpCode: vi.fn().mockReturnValue({ subscribe: vi.fn() }) };

    await TestBed.configureTestingModule({
      imports: [VerifySignup],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(VerifySignup);
    component = fixture.componentInstance;
  });

  it('submitOtp delegates to AuthService.verifyPhoneOtpCode', () => {
    component.verifyRegisterOtp({ isCalled: true, otp: '123456' });
    expect(authMock.verifyPhoneOtpCode).toHaveBeenCalledWith('123456');
  });

    it('resendOtp should call AuthService.resetPhoneOtp when isCalled is true', () => {
      authMock.resetPhoneOtp = vi.fn().mockReturnValue({ subscribe: vi.fn() });
      component.resendOtp(true);
      expect(authMock.resetPhoneOtp).toHaveBeenCalled();
    });

    it('resendOtp should NOT call AuthService.resetPhoneOtp when isCalled is false', () => {
      authMock.resetPhoneOtp = vi.fn();
      component.resendOtp(false);
      expect(authMock.resetPhoneOtp).not.toHaveBeenCalled();
    });
});
