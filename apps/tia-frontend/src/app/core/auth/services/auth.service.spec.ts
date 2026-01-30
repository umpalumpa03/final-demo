import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { TokenService } from './token.service';
import { UserActivityService } from './user-activity.service';
import { environment } from '../../../../environments/environment';
import { Routes } from '../models/tokens.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: { navigate: any };
  let tokenSpy: any;
  let activitySpy: any;

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };

    tokenSpy = {
      setVerifyToken: vi.fn(),
      setAccessToken: vi.fn(),
      setRefreshToken: vi.fn(),
      clearAuthToken: vi.fn(),
      clearAccessToken: vi.fn(),
      clearAllToken: vi.fn(),
      accessToken: null,
      getSignUpToken: null,
      verifyToken: null,
    };

    activitySpy = {
      startMonitoring: vi.fn(),
      stopMonitoring: vi.fn(),
      setIdleTimeout: vi.fn(),
      idle$: of(false),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: TokenService, useValue: tokenSpy },
        { provide: UserActivityService, useValue: activitySpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should set and get challenge id', () => {
    service.setChellangeId('abc123');
    expect(service.getChallengeId()).toBe('abc123');
  });

  it('loginPostRequest navigates to OTP on mfa_required', async () => {
    service.loginPostRequest({ username: 'u', password: 'p' } as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ status: 'mfa_required', challengeId: 'cid' });

    await Promise.resolve();
    expect(service.getChallengeId()).toBe('cid');
    expect(routerSpy.navigate).toHaveBeenCalledWith([Routes.OTP_SIGN_IN]);
  });

  it('loginPostRequest stores verify token and navigates to phone when required', async () => {
    service.loginPostRequest({ username: 'u', password: 'p' } as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ status: 'phone_verification_required', verification_token: 'vt' });

    await Promise.resolve();
    expect(tokenSpy.setVerifyToken).toHaveBeenCalledWith('vt');
    expect(routerSpy.navigate).toHaveBeenCalledWith([Routes.PHONE]);
  });

  it('loginPostRequest sets errorMessage on error', async () => {
    service.loginPostRequest({ username: 'u', password: 'p' } as any).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    await Promise.resolve();
    expect(service.errorMessage()).toBe(true);
  });

  it('verifyMfa sets tokens and navigates on success', async () => {
    service.verifyMfa({ code: '1', challengeId: 'c' } as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/verify`);
    req.flush({ access_token: 'a', refresh_token: 'r' });

    await Promise.resolve();
    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('a');
    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('r');
    expect(activitySpy.startMonitoring).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([Routes.DASHBOARD]);
  });

  it('refreshTokenPostRequest sets tokens on success', async () => {
    service
      .refreshTokenPostRequest({ refresh_token: 'r' } as any)
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    req.flush({ access_token: 'a', refresh_token: 'r' });

    await Promise.resolve();
    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('a');
    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('r');
  });

  it('sendPhoneVerificationCode sends Authorization header', async () => {
    tokenSpy.getSignUpToken = 'signup-token';

    service.sendPhoneVerificationCode('123').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer signup-token');
    req.flush({});
    await Promise.resolve();
  });

  it('verifyPhoneOtpCode clears tokens and navigates on success', async () => {
    tokenSpy.getSignUpToken = 'signup-token';
    service.setChellangeId('cid');

    service.verifyPhoneOtpCode('111').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone/verify`);
    expect(req.request.body).toEqual({ challengeId: 'cid', code: '111' });
    req.flush({});

    await Promise.resolve();
    expect(tokenSpy.clearAllToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });

  it('forgotPasswordRequest posts the email', async () => {
    service.forgotPasswordRequest('me@here.com').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
    expect(req.request.body).toEqual({ email: 'me@here.com' });
    req.flush({});

    await Promise.resolve();
  });

  it('verifyForgotPasswordOtp sets access token on success', async () => {
    service.setChellangeId('cid');

    service.verifyForgotPasswordOtp('000').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/forgot-password/verify`,
    );
    req.flush({ access_token: 'access-1' });

    await Promise.resolve();
    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('access-1');
  });

  it('resendVerificationCode posts challengeId with Authorization header', async () => {
    service.setChellangeId('cid');
    tokenSpy.getSignUpToken = 'signup-token';

    service.resendVerificationCode().subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/mfa/otp-resend`,
    );
    expect(req.request.body).toEqual({ challengeId: 'cid' });
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer signup-token',
    );
    req.flush({});

    await Promise.resolve();
  });

  it('createNewPassword posts with Authorization header when access token present', async () => {
    tokenSpy.accessToken = 'access-xyz';

    service.createNewPassword('newpass').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/create-new-password`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-xyz');
    expect(req.request.body).toEqual({ password: 'newpass' });
    req.flush({});
    await Promise.resolve();
  });

  it('resetPhoneOtp posts when challengeId set', async () => {
    service.setChellangeId('cid-123');

    service.resetPhoneOtp().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.body).toEqual({ challengeId: 'cid-123' });
    req.flush({});
    await Promise.resolve();
  });

  it('refreshTokenPostRequest sets errorMessage on error response', async () => {
    service.refreshTokenPostRequest({ refresh_token: 'r' } as any).subscribe({ error: () => {} });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    await Promise.resolve();
    expect(service.errorMessage()).toBe(true);
  });

  it('logout clears tokens and navigates', async () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush({ success: true });

    await Promise.resolve();
    expect(tokenSpy.clearAuthToken).toHaveBeenCalled();
    expect(activitySpy.stopMonitoring).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
  });

  it('createNewPassword errors when no access token', async () => {
    tokenSpy.accessToken = null;
    service.createNewPassword('pw').subscribe({
      next: () => {},
      error: (err: Error) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Missing forgot password access token');
      },
    });
    await Promise.resolve();
  });

  it('resetPhoneOtp errors when no challengeId', async () => {
    // ensure no challenge set
    service.setChellangeId('');
    service.resetPhoneOtp().subscribe({
      next: () => {},
      error: (err: Error) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Missing forgot password challengeId');
      },
    });
    await Promise.resolve();
  });

  it('setIdleTimeout delegates to userActivityService', () => {
    service.setIdleTimeout(5);
    expect(activitySpy.setIdleTimeout).toHaveBeenCalledWith(5);
  });
});
