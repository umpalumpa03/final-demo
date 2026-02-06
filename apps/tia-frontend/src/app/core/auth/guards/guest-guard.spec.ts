import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { GuestGuard } from './guest-guard';
import { TokenService } from '../services/token.service';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';

describe('GuestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: UserInfoService, useValue: { getUserInfo: () => of(null) } },
        { provide: Router, useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) } },
      ],
    });
  });

  it('returns true when tokens missing', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: {} });
    const result = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('returns true when tokens exist but userInfo missing', async () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { accessToken: 'a', refreshToken: 'b' } });
    TestBed.overrideProvider(UserInfoService as any, { useValue: { getUserInfo: () => of(null) } });

    const result$ = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);
    expect(value).toBe(true);
  });

  it('redirects to DASHBOARD when user info exists', async () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { accessToken: 'a', refreshToken: 'b' } });
    TestBed.overrideProvider(UserInfoService as any, { useValue: { getUserInfo: () => of({ id: '1' }) } });

    const result$ = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);
    expect(value).toEqual({ redirect: [Routes.DASHBOARD] });
  });

  it('returns UrlTree to SIGN_IN when user service errors', async () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { accessToken: 'a', refreshToken: 'b' } });
    TestBed.overrideProvider(UserInfoService as any, { useValue: { getUserInfo: () => throwError(() => new Error('boom')) } });

    const result$ = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);
    expect(value).toEqual({ redirect: [Routes.SIGN_IN] });
  });
});

describe('guestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
