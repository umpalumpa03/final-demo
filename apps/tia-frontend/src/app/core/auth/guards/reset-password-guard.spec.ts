import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ResetPasswordGuard } from './reset-password-guard';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';

describe('ResetPasswordGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: Router, useValue: { navigate: vi.fn(() => false) } },
      ],
    });
  });

  it('returns true when accessToken exists and no refreshToken', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { accessToken: 'a', refreshToken: null } });
    const result = TestBed.runInInjectionContext(() => ResetPasswordGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('calls navigate when condition not met', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { accessToken: null, refreshToken: 'r' } });
    const router = TestBed.inject(Router) as any;
    const result = TestBed.runInInjectionContext(() => ResetPasswordGuard({} as any, {} as any));
    expect(router.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
    expect(result).toBe(false);
  });
});
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { resetPasswordGuard } from './reset-password-guard';

describe('resetPasswordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => resetPasswordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
