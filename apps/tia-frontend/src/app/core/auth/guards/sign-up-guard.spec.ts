import { TestBed } from '@angular/core/testing';
import { signUpGuard } from './sign-up-guard';
import { TokenService } from '../services/token.service';

describe('signUpGuard', () => {
  let mockTokenService: Partial<TokenService>;

  beforeEach(() => {
    mockTokenService = {
      getSignUpToken: null,
    } as Partial<TokenService>;

    TestBed.configureTestingModule({
      providers: [{ provide: TokenService, useValue: mockTokenService }],
    });
  });

  it('should allow access if getSignUpToken exists', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { getSignUpToken: 'token123' } });

      const result = TestBed.runInInjectionContext(() => signUpGuard(null as any, null as any));

    expect(result).toBeTruthy();
  });

  it('should block access if getSignUpToken is missing', () => {
    TestBed.overrideProvider(TokenService as any, { useValue: { getSignUpToken: null } });

      const result = TestBed.runInInjectionContext(() => signUpGuard(null as any, null as any));

    expect(result).toBeFalsy();
  });
});
