import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';

import { AuthGuard } from './auth-guard';
import { TokenService } from '../services/token.service';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: UserInfoService, useValue: { getUserInfo: () => of(null) } },
        {
          provide: Router,
          useValue: { navigate: vi.fn(), createUrlTree: vi.fn((p: any) => ({ redirect: p })) },
        },
      ],
    });
  });

  it('resolves to false when tokens exist but user info is missing', async () => {
    TestBed.overrideProvider(TokenService as any, {
      useValue: { accessToken: 'a', refreshToken: 'b' },
    });

    TestBed.overrideProvider(UserInfoService as any, {
      useValue: { getUserInfo: () => of(null) },
    });

    const result$ = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);

    expect(value).toBe(false);
  });

  it('resolves to true when tokens exist and user info is present', async () => {
    TestBed.overrideProvider(TokenService as any, {
      useValue: { accessToken: 'a', refreshToken: 'b' },
    });

    TestBed.overrideProvider(UserInfoService as any, {
      useValue: { getUserInfo: () => of({ id: '1', name: 'User' }) },
    });

    const result$ = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);

    expect(value).toBe(true);
  });

  it('navigates to SIGN_IN when tokens are missing', async () => {
    TestBed.overrideProvider(TokenService as any, { useValue: {} });
    TestBed.overrideProvider(UserInfoService as any, {
      useValue: { getUserInfo: () => of(null) },
    });

    const router = TestBed.inject(Router) as any;

    const result$ = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    // await the observable to allow any internals to run
    const value = await firstValueFrom(result$ as any);

    expect(router.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
    expect(value).toBe(false);
  });

  it('returns UrlTree when user service throws', async () => {
    TestBed.overrideProvider(TokenService as any, {
      useValue: { accessToken: 'a', refreshToken: 'b' },
    });

    TestBed.overrideProvider(UserInfoService as any, {
      useValue: { getUserInfo: () => throwError(() => new Error('boom')) },
    });

    const router = TestBed.inject(Router) as any;

    const result$ = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    const value = await firstValueFrom(result$ as any);

    // our mock createUrlTree returns an object with redirect prop
    expect(value).toEqual({ redirect: [Routes.SIGN_IN] });
    expect(router.createUrlTree).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });
});
