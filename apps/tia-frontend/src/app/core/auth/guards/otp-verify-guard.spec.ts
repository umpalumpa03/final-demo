import { TestBed } from '@angular/core/testing';

import { otpVerifyGuard } from './otp-verify-guard';
import { AuthService } from '../services/auth.service';

describe('otpVerifyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: {} }],
    });
  });

  it('returns true when challenge id exists', () => {
    TestBed.overrideProvider(AuthService as any, {
      useValue: { getChallengeId: () => 'challenge' },
    });

    const result = TestBed.runInInjectionContext(() => otpVerifyGuard());

    expect(result).toBeTruthy();
  });

  it('returns false when challenge id is missing', () => {
    TestBed.overrideProvider(AuthService as any, {
      useValue: { getChallengeId: () => null },
    });

    const result = TestBed.runInInjectionContext(() => otpVerifyGuard());

    expect(result).toBeFalsy();
  });
});
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { otpVerifyGuard } from './otp-verify-guard';

describe('otpVerifyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => otpVerifyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
