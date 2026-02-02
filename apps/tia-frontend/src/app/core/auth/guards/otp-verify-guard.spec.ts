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
