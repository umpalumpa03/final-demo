import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AuthGuard } from './auth-guard';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';
import { selectUserInfoState } from '../../../store/user-info/user-info.selectors';

describe('AuthGuard', () => {
  it('returns UrlTree when tokens are missing', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: TokenService, useValue: { accessToken: null, refreshToken: null } },
        {
          provide: Router,
          useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toEqual({ redirect: [Routes.SIGN_IN] });
  });

  it('returns true when tokens present and user loaded without error', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfoState, value: { loaded: true, error: null, fullName: 'John' } }
          ]
        }),
        { provide: TokenService, useValue: { accessToken: 'token', refreshToken: 'refresh' } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toBe(true);
  });

  it('returns UrlTree when tokens present and user loaded with error', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfoState, value: { loaded: true, error: 'error', fullName: null } }
          ]
        }),
        { provide: TokenService, useValue: { accessToken: 'token', refreshToken: 'refresh' } },
        {
          provide: Router,
          useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toEqual({ redirect: [Routes.SIGN_IN] });
  });
});
