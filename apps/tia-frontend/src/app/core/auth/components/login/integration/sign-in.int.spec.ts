import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  LoginTestContext,
  setupLoginTest,
  cleanupLoginTest,
} from './login.test-helpers';

describe('Auth — SignIn Integration', () => {
  let ctx: LoginTestContext;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(async () => {
    ctx = await setupLoginTest();
  });

  afterEach(() => {
    cleanupLoginTest(ctx.httpMock);
    vi.restoreAllMocks();
  });

  it('should navigate to OTP sign-in when MFA is required', async () => {
    let response: any;

    ctx.authService.loginPostRequest({ username: 'u', password: 'p' }).subscribe((res) => (response = res));

    const req = ctx.httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');

    req.flush({ status: 'mfa_required', challengeId: 'challenge-123' });

    expect(response.status).toBe('mfa_required');
    expect(ctx.authService.getChallengeId()).toBe('challenge-123');
  });

  it('should set verify token and navigate to PHONE when phone verification is required', async () => {
    let response: any;

    ctx.authService.loginPostRequest({ username: 'u', password: 'p' }).subscribe((res) => (response = res));

    const req = ctx.httpMock.expectOne(`${baseUrl}/login`);
    req.flush({ status: 'phone_verification_required', verification_token: 'verify-123' });

    expect(response.status).toBe('phone_verification_required');
    expect(ctx.tokenService.verifyToken).toBe('verify-123');
  });

  it('should surface credential errors and stop loading on failure', async () => {
    let err: any;

    ctx.authService.loginPostRequest({ username: 'u', password: 'bad' }).subscribe({
      next: () => {},
      error: (e) => (err = e),
    });

    const req = ctx.httpMock.expectOne(`${baseUrl}/login`);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(err).toBeTruthy();
    expect(ctx.authService.isLoginLoading()).toBe(false);
  });
});
