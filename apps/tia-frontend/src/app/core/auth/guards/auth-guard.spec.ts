import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard';
import { TokenService } from '../services/token.service';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TokenService, useValue: {} }],
    });
  });

  it('returns false when tokens exist', () => {
    TestBed.overrideProvider(TokenService as any, {
      useValue: { accessToken: 'a', refreshToken: 'b' },
    });

    const result = TestBed.runInInjectionContext(() => AuthGuard());

    expect(result).toBeFalsy();
  });

  it('returns true when tokens are missing', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: {} });

    const result = TestBed.runInInjectionContext(() => AuthGuard());

    expect(result).toBeTruthy();
  });
});
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
