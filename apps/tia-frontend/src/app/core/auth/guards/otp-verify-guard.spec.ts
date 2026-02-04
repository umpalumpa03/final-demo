import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { OtpVerifyGuard } from './otp-verify-guard';
import { AuthService } from '../services/auth.service';

describe('otpVerifyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: {} }],
    });
  });
});

describe('otpVerifyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => OtpVerifyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
