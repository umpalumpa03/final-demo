import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;
  let router: Router;

  beforeEach(() => {
    const routerMock = { navigate: vi.fn() };

    const tokenServiceMock = {
      setVerifyToken: vi.fn(),
      setAccessToken: vi.fn(),
      setRefreshToken: vi.fn(),
      clearAccessToken: vi.fn(),
      get accessToken() { return 'fake-token'; },
      get getSignUpToken() { return 'signup-token'; },
      get verifyToken() { return 'verify-token'; }
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loginPostRequest', () => {
    it('should set challengeId and navigate to otp-verify when status is mfa_required', () => {
      const mockResponse = { status: 'mfa_required', challengeId: '123' };
      service.loginPostRequest({ username: 'user', password: '123' }).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockResponse);
      expect(service.getChallengeId()).toBe('123');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/otp-verify']);
    });

    it('should set verify token and navigate to phone when status is phone_verification_required', () => {
      const mockResponse = { status: 'phone_verification_required', verification_token: 'v-123' };
      service.loginPostRequest({ username: 'user', password: '123' }).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockResponse);
      expect(tokenService.setVerifyToken).toHaveBeenCalledWith('v-123');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/phone']);
    });

    it('should set loginError signal on catchError', () => {
      service.loginPostRequest({ username: 'user', password: '123' }).subscribe({
        error: (err) => expect(err).toBeTruthy(),
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });
      expect(service.loginError()).toBe('Error');
      expect(service.isLoginLoading()).toBe(false);
    });
  });

  describe('Token & Registration', () => {
    it('should refresh tokens and store them on success', () => {
      const mockRes = { access_token: 'at', refresh_token: 'rt' };
      service.refreshTokenPostRequest({ refresh_token: 'old' }).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      req.flush(mockRes);
      expect(tokenService.setAccessToken).toHaveBeenCalledWith('at');
      expect(tokenService.setRefreshToken).toHaveBeenCalledWith('rt');
    });

    it('should sign up user', () => {
      service.signUpUser({} as any).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
      req.flush({ success: true });
    });
  });

  describe('verifyMfa', () => {
    it('should store tokens and navigate to dashboard', () => {
      const mockRes = { access_token: 'at', refresh_token: 'rt' };
      service.verifyMfa({ code: '1', challengeId: '1' }).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/verify`);
      req.flush(mockRes);
      expect(tokenService.setAccessToken).toHaveBeenCalledWith('at');
      expect(router.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
    });
  });

  describe('logout', () => {
    it('should clear access token if success', () => {
      service.logout().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      req.flush({ success: true });
      expect(tokenService.clearAccessToken).toHaveBeenCalled();
    });
  });

  describe('OTP & Verification', () => {
    it('should send phone verification code with headers', () => {
      service.sendPhoneVerificationCode('123').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone`);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });

    it('should verify otp code', () => {
      vi.spyOn(service, 'getChallengeId').mockReturnValue('ch-1');
      service.verifyOtpCode('123456').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone/verify`);
      req.flush({});
    });

    it('should resend verification code', () => {
      vi.spyOn(service, 'getChallengeId').mockReturnValue('ch-1');
      service.resendVerificationCode().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
      req.flush({});
    });
  });

  describe('Password Recovery', () => {
    it('should handle forgot password request', () => {
      service.forgotPasswordRequest('a@a.com').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
      req.flush({ challengeId: 'ch-1' });
      expect(service.getChallengeId()).toBe('ch-1');
    });

    it('should verify forgot password otp', () => {
      vi.spyOn(service, 'getChallengeId').mockReturnValue('ch-1');
      service.verifyForgotPasswordOtp('123').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password/verify`);
      req.flush({ access_token: 'at' });
      expect(tokenService.setAccessToken).toHaveBeenCalledWith('at');
    });

    it('should throw error in createNewPassword if no token exists', () => {
      vi.spyOn(tokenService, 'accessToken', 'get').mockReturnValue(null as any);
      service.createNewPassword('p').subscribe({
        error: (err) => expect(err.message).toBe('Missing forgot password access token'),
      });
    });

    it('should create new password with headers', () => {
      service.createNewPassword('p').subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/create-new-password`);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });

  describe('Reset & Resend', () => {
    it('should throw error in resetPhoneOtp if no challengeId', () => {
      vi.spyOn(service, 'getChallengeId').mockReturnValue('');
      service.resetPhoneOtp().subscribe({
        error: (err) => expect(err.message).toBe('Missing forgot password challengeId'),
      });
    });

    it('should call resetPhoneOtp API', () => {
      vi.spyOn(service, 'getChallengeId').mockReturnValue('ch-1');
      service.resetPhoneOtp().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
      req.flush({});
    });
  });

  describe('Helper methods', () => {
    it('should return isLoggedIn status', () => {
      expect(service.isLoggedIn()).toBe(true);
    });
  });
});