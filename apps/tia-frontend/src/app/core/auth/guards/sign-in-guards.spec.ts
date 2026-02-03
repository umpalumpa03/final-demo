import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SignInGuard } from './sign-in-guards';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

describe('SignInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    });
  });

  it('returns UrlTree when authenticated', () => {
    const fakeUrlTree = {} as any;

    TestBed.overrideProvider(TokenService as any, {
      useValue: { accessToken: 'a', refreshToken: 'b' },
    });
    TestBed.overrideProvider(AuthService as any, {
      useValue: { getChallengeId: () => 'c' },
    });
    TestBed.overrideProvider(Router as any, {
      useValue: { createUrlTree: () => fakeUrlTree },
    });

    const result = TestBed.runInInjectionContext(() => SignInGuard());

    expect(result).toBe(fakeUrlTree);
  });

  it('returns true when not authenticated', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: {} });
    TestBed.overrideProvider(AuthService as any, { useValue: { getChallengeId: () => null } });

    const result = TestBed.runInInjectionContext(() => SignInGuard());

    expect(result).toBeTruthy();
  });
});
