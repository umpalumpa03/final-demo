import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  LoginTestContext,
  setupLoginTest,
  cleanupLoginTest,
} from './login.test-helpers';

describe('Auth — VerifySignin Integration', () => {
  let ctx: LoginTestContext;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(async () => {
    ctx = await setupLoginTest();
  });

  afterEach(() => {
    cleanupLoginTest(ctx.httpMock);
    vi.restoreAllMocks();
  });

  it('should verify MFA, set tokens, dispatch loadUser and stop loading', async () => {
    const payload = { code: '123456', challengeId: 'challenge-1' } as any;
    let response: any;

    ctx.authService.verifyMfa(payload).subscribe((res) => (response = res));

    const req = ctx.httpMock.expectOne(`${baseUrl}/mfa/verify`);
    expect(req.request.method).toBe('POST');

    req.flush({ access_token: 'access-1', refresh_token: 'refresh-1' });

    expect(ctx.tokenService.accessToken).toBe('access-1');
    expect(ctx.tokenService.accessToken).toBeDefined();
    expect(ctx.authService.isLoginLoading()).toBe(false);
  });

  it('should set otpError and errorMessage on invalid code', async () => {
    const payload = { code: '000000', challengeId: 'challenge-1' } as any;

    let completed = false;
    ctx.authService.verifyMfa(payload).subscribe({
      next: () => {},
      complete: () => (completed = true),
    });

    const req = ctx.httpMock.expectOne(`${baseUrl}/mfa/verify`);
    req.flush({ message: 'Invalid code' }, { status: 400, statusText: 'Bad Request' });

    expect(ctx.authService.otpError()).not.toBeNull();
    expect(ctx.authService.errorMessage()).toBe(true);
    expect(ctx.authService.isLoginLoading()).toBe(false);
  });
});
