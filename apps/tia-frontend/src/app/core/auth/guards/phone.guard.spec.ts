import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { PhoneGuard } from './phone.guard';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';

describe('PhoneGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: Router, useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) } },
      ],
    });
  });

  it('returns true when signup token present', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { getSignUpToken: 't' } });
    const result = TestBed.runInInjectionContext(() => PhoneGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('returns true when verify token present', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { verifyToken: 'v' } });
    const result = TestBed.runInInjectionContext(() => PhoneGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to SIGN_IN when no tokens', () => {
    const result = TestBed.runInInjectionContext(() => PhoneGuard({} as any, {} as any));
    expect(result).toEqual({ redirect: [Routes.SIGN_IN] });
  });
});
