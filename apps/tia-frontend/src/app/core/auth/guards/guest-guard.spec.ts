import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { GuestGuard } from './guest-guard';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../models/tokens.model';
import { selectUserInfoState } from '../../../store/user-info/user-info.selectors';

describe('GuestGuard', () => {
  it('returns true when tokens missing', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: TokenService, useValue: { accessToken: null, refreshToken: null } },
        { provide: Router, useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toBe(true);
  });

  it('returns UrlTree when tokens present and user loaded with fullName', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfoState, value: { loaded: true, error: null, fullName: 'John' } }
          ]
        }),
        { provide: TokenService, useValue: { accessToken: 'token', refreshToken: 'refresh' } },
        {
          provide: Router,
          useValue: { createUrlTree: vi.fn((p: any) => ({ redirect: p })) },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toEqual({ redirect: [Routes.DASHBOARD] });
  });

  it('returns true when tokens present and user loaded without fullName', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfoState, value: { loaded: true, error: null, fullName: null } }
          ]
        }),
        { provide: TokenService, useValue: { accessToken: 'token', refreshToken: 'refresh' } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toBe(true);
  });

  it('returns true when tokens present and user loaded with error', () => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfoState, value: { loaded: true, error: 'error', fullName: null } }
          ]
        }),
        { provide: TokenService, useValue: { accessToken: 'token', refreshToken: 'refresh' } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => GuestGuard({} as any, {} as any));
    let value: any;
    (result as any).subscribe((v: any) => value = v);
    expect(value).toBe(true);
  });
});
