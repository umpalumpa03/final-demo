import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment';
import { Routes } from '../models/tokens.model';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let tokenService: TokenService;
  let store: Store;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    const routerMock = {
      navigate: vi.fn(),
    };

    const tokenServiceMock = {
      clearAllToken: vi.fn(),
      setAccessToken: vi.fn(),
      setRefreshToken: vi.fn(),
      setVerifyToken: vi.fn(),
      setResetPasswordToken: vi.fn(),
      clearAuthToken: vi.fn(),
      clearUserInfo: vi.fn(),
      clearAccessToken: vi.fn(),
      clearSignUpToken: vi.fn(),
      accessToken: 'test-access-token',
      resetPasswordToken: 'test-reset-password-token',
      verifyToken: 'test-verify-token',
      getSignUpToken: 'test-signup-token',
    };

    const storeMock = {
      dispatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: TranslateService, useValue: { instant: (k: any) => k } },
        { provide: AlertService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('challengeId', () => {
    it('should set and get challenge id', () => {
      service.setChellangeId('test-challenge-id');
      expect(service.getChallengeId()).toBe('test-challenge-id');
    });
  });

  describe('loginPostRequest', () => {
    it('should login with mfa_required status', async () => {
      const loginData = { username: 'test@test.com', password: 'password' };
      const mockResponse = {
        status: 'mfa_required',
        challengeId: 'challenge-123',
      };

      const promise = new Promise<void>((resolve) => {
        service.loginPostRequest(loginData).subscribe({
          next: (res) => {
            expect(res.status).toBe('mfa_required');
            expect(tokenService.clearAllToken).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith([Routes.OTP_SIGN_IN]);
            expect(service.getChallengeId()).toBe('challenge-123');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(service.isLoginLoading()).toBe(true);
      req.flush(mockResponse);
      
      await promise;
      expect(service.isLoginLoading()).toBe(false);
    });

    it('should login with phone_verification_required status', async () => {
      const loginData = { username: 'test@test.com', password: 'password' };
      const mockResponse = {
        status: 'phone_verification_required',
        verification_token: 'verify-token-123',
      };

      const promise = new Promise<void>((resolve) => {
        service.loginPostRequest(loginData).subscribe({
          next: (res) => {
            expect(res.status).toBe('phone_verification_required');
            expect(tokenService.setVerifyToken).toHaveBeenCalledWith('verify-token-123');
            expect(router.navigate).toHaveBeenCalledWith([Routes.PHONE]);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(mockResponse);
      await promise;
    });

    it('should handle login error', async () => {
      const loginData = { username: 'test@test.com', password: 'wrong' };

      const promise = new Promise<void>((resolve) => {
        service.loginPostRequest(loginData).subscribe({
          error: () => {
            expect(service.errorMessage()).toBe(true);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
      
      await promise;
      expect(service.isLoginLoading()).toBe(false);
    });
  });

  describe('refreshTokenPostRequest', () => {
    it('should refresh token successfully', async () => {
      const refreshData = { refresh_token: 'refresh-token' };
      const mockResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };

      const promise = new Promise<void>((resolve) => {
        service.refreshTokenPostRequest(refreshData).subscribe({
          next: () => {
            expect(tokenService.setAccessToken).toHaveBeenCalledWith('new-access-token');
            expect(tokenService.setRefreshToken).toHaveBeenCalledWith('new-refresh-token');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/refresh`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
      await promise;
    });

    it('should handle refresh token error', async () => {
      const refreshData = { refresh_token: 'invalid-token' };

      const promise = new Promise<void>((resolve) => {
        service.refreshTokenPostRequest(refreshData).subscribe({
          error: () => {
            expect(service.errorMessage()).toBe(true);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/refresh`);
      req.flush({ message: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });
      await promise;
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = { success: true };

      const promise = new Promise<void>((resolve) => {
        service.logout().subscribe({
          next: (res) => {
            expect(res.success).toBe(true);
            expect(tokenService.clearAuthToken).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/logout`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('verifyMfa', () => {
    it('should verify MFA successfully', async () => {
      const verifyData = { code: '123456', challengeId: 'challenge-id' };
      const mockResponse = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      const promise = new Promise<void>((resolve) => {
        service.verifyMfa(verifyData).subscribe({
          next: () => {
            expect(tokenService.setAccessToken).toHaveBeenCalledWith('access-token');
            expect(tokenService.setRefreshToken).toHaveBeenCalledWith('refresh-token');
            expect(store.dispatch).toHaveBeenCalledWith(UserInfoActions.loadUser());
            expect(router.navigate).toHaveBeenCalledWith([Routes.DASHBOARD]);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/mfa/verify`);
      expect(service.isLoginLoading()).toBe(true);
      req.flush(mockResponse);
      
      await promise;
      expect(service.isLoginLoading()).toBe(false);
    });

    it('should handle MFA verification error', async () => {
      const verifyData = { code: 'wrong', challengeId: 'challenge-id' };

      const promise = new Promise<void>((resolve) => {
        service.verifyMfa(verifyData).subscribe({
          complete: () => {
            expect(service.errorMessage()).toBe(true);
            expect(service.otpError()).not.toBeNull();
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/mfa/verify`);
      req.flush({ message: 'Invalid code' }, { status: 400, statusText: 'Bad Request' });
      
      await promise;
      expect(service.isLoginLoading()).toBe(false);
    });
  });

  describe('signUpUser', () => {
    it('should sign up user successfully', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      } as any;
      const mockResponse = { id: '123', email: 'test@test.com', username: 'testuser', createdAt: '2024-01-01', signup_token: 'token' };

      const promise = new Promise<void>((resolve) => {
        service.signUpUser(userData).subscribe({
          next: (res) => {
            expect(res.id).toBe('123');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/signup`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('sendPhoneVerificationCode', () => {
    it('should send phone verification code', async () => {
      const phoneNumber = '+1234567890';
      const mockResponse = { message: 'Verification code sent', challengeId: 'challenge-456', method: 'sms' };

      const promise = new Promise<void>((resolve) => {
        service.sendPhoneVerificationCode(phoneNumber).subscribe({
          next: (res) => {
            expect(res.message).toBe('Verification code sent');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/phone`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ phone: phoneNumber });
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-signup-token');
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('verifyPhoneOtpCode', () => {
    it('should verify phone OTP code successfully', async () => {
      service.setChellangeId('challenge-123');
      const code = '123456';
      const mockResponse = { message: 'Phone verified successfully' };

        const obs$ = service.verifyPhoneOtpCode(code);
        const promise = firstValueFrom<any>(obs$ as any);

        const req = httpMock.expectOne(`${baseUrl}/phone/verify`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ challengeId: 'challenge-123', code });
        req.flush(mockResponse);

        const res = await promise;
        expect(res.message).toBe('Phone verified successfully');
        expect(tokenService.clearAuthToken).toHaveBeenCalled();
        expect(tokenService.clearSignUpToken).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([Routes.SIGN_IN]);
        expect(service.isLoginLoading()).toBe(false);
    });

    it('should handle phone OTP verification error', async () => {
      service.setChellangeId('challenge-123');
      const code = 'wrong';

      const promise = new Promise<void>((resolve) => {
        service.verifyPhoneOtpCode(code).subscribe({
          error: () => {
            expect(service.otpError()).not.toBeNull();
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/phone/verify`);
      req.flush({ message: 'Invalid code' }, { status: 400, statusText: 'Bad Request' });
      
      await promise;
      expect(service.isLoginLoading()).toBe(false);
    });
  });

  describe('forgotPasswordRequest', () => {
    it('should send forgot password request', async () => {
      const email = 'test@test.com';
      const mockResponse = { challengeId: 'forgot-challenge-123' };

      const promise = new Promise<void>((resolve) => {
        service.forgotPasswordRequest(email).subscribe({
          next: (res) => {
            expect(res.challengeId).toBe('forgot-challenge-123');
            expect(service.getChallengeId()).toBe('forgot-challenge-123');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('verifyForgotPasswordOtp', () => {
    it('should verify forgot password OTP', async () => {
      service.setChellangeId('forgot-challenge-123');
      const code = '123456';
      const mockResponse = { access_token: 'forgot-access-token' };

      const promise = new Promise<void>((resolve) => {
        service.verifyForgotPasswordOtp(code).subscribe({
          next: () => {
            expect(tokenService.clearAccessToken).toHaveBeenCalled();
            expect(tokenService.setResetPasswordToken).toHaveBeenCalledWith('forgot-access-token');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
      expect(req.request.body).toEqual({ challengeId: 'forgot-challenge-123', code });
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('createNewPassword', () => {
    it('should create new password successfully', async () => {
      const password = 'newPassword123';
      const mockResponse = { success: true };

      const promise = new Promise<void>((resolve) => {
        service.createNewPassword(password).subscribe({
          next: (res) => {
            expect(res.success).toBe(true);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ password });
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-reset-password-token');
      req.flush(mockResponse);
      await promise;
    });

    it('should throw error when token is missing', async () => {
      (tokenService as any).resetPasswordToken = null;
      const password = 'newPassword123';

      const promise = new Promise<void>((resolve) => {
        service.createNewPassword(password).subscribe({
          error: (err) => {
            expect(err.message).toBe('Missing reset password token');
            resolve();
          },
        });
      });

      await promise;
    });
  });

  describe('resetPhoneOtp', () => {
    it('should reset phone OTP successfully', async () => {
      service.setChellangeId('challenge-123');
      const mockResponse = { success: true };

      const promise = new Promise<void>((resolve) => {
        service.resendPhoneOtp().subscribe({
          next: (res) => {
            expect(res.success).toBe(true);
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/phone/otp-resend`);
      expect(req.request.body).toEqual({ challengeId: 'challenge-123' });
      req.flush(mockResponse);
      await promise;
    });

    it('should throw error when challengeId is missing', async () => {
      service.setChellangeId('');

      const promise = new Promise<void>((resolve) => {
        service.resendPhoneOtp().subscribe({
          error: (err) => {
            expect(err.message).toBe('Missing forgot password challengeId');
            resolve();
          },
        });
      });

      await promise;
    });
  });

  describe('resendVerificationCode', () => {
    it('should resend verification code successfully', async () => {
      service.setChellangeId('challenge-123');
      const mockResponse = { message: 'Verification code resent' };

      const promise = new Promise<void>((resolve) => {
        service.resendVerificationCode().subscribe({
          next: (res) => {
            expect(res.message).toBe('Verification code resent');
            resolve();
          },
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/mfa/otp-resend`);
      expect(req.request.body).toEqual({ challengeId: 'challenge-123' });
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-access-token');
      req.flush(mockResponse);
      await promise;
    });
  });

  describe('signals', () => {
    it('should initialize with default signal values', () => {
      expect(service.isLoginLoading()).toBe(false);
      expect(service.errorMessage()).toBe(false);
    });
  });
});