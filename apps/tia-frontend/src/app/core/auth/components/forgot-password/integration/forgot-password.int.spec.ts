import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import {
  ForgotPasswordTestContext,
  setupForgotPasswordTest,
  cleanupForgotPasswordTest,
  mockForgotPasswordResponse,
  mockVerifyOtpResponse,
  mockCreatePasswordResponse,
} from './forgot-password.test-helpers';
import {
  ForgotPasswordResponse,
  ForgotPasswordVerifyResponse,
  CreateNewPasswordResponse,
} from '../../../models/authResponse.model';

describe('Forgot Password Integration', () => {
  let ctx: ForgotPasswordTestContext;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(async () => {
    ctx = await setupForgotPasswordTest();
  });

  afterEach(() => {
    cleanupForgotPasswordTest(ctx.httpMock);
  });

  describe('Step 1: Forgot Password Request', () => {
    it('should send forgot password request and store challengeId', () => {
      let response: ForgotPasswordResponse;
      ctx.authService.forgotPasswordRequest('john@test.com').subscribe((res) => {
        response = res;
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'john@test.com' });

      req.flush(mockForgotPasswordResponse);

      expect(response!).toEqual(mockForgotPasswordResponse);
      expect(ctx.authService.getChallengeId()).toBe('challenge-123');
    });

    it('should handle 404 error for non-existent email', () => {
      let error: HttpErrorResponse;
      ctx.authService.forgotPasswordRequest('unknown@test.com').subscribe({
        error: (err) => {
          error = err;
        },
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password`);
      req.flush(
        { message: 'User not found' },
        { status: 404, statusText: 'Not Found' },
      );

      expect(error!).toBeTruthy();
      expect(error!.status).toBe(404);
    });

    it('should handle 400 error for invalid email', () => {
      let error: HttpErrorResponse;
      ctx.authService.forgotPasswordRequest('invalid').subscribe({
        error: (err) => {
          error = err;
        },
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password`);
      req.flush(
        { message: 'Invalid email format' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(error!).toBeTruthy();
      expect(error!.status).toBe(400);
    });
  });

  describe('Step 2: Verify OTP', () => {
    it('should verify OTP and store reset password token', () => {
      ctx.authService.setChellangeId('challenge-123');
      let response: ForgotPasswordVerifyResponse;

      ctx.authService.verifyForgotPasswordOtp('123456').subscribe((res) => {
        response = res;
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        challengeId: 'challenge-123',
        code: '123456',
      });

      req.flush(mockVerifyOtpResponse);

      expect(response!).toEqual(mockVerifyOtpResponse);
      expect(ctx.tokenService.resetPasswordToken).toBe('reset-token-abc');
      expect(ctx.authService.isLoginLoading()).toBe(false);
    });

    it('should handle invalid OTP error', () => {
      ctx.authService.setChellangeId('challenge-123');
      let error: HttpErrorResponse;

      ctx.authService.verifyForgotPasswordOtp('000000').subscribe({
        error: (err) => {
          error = err;
        },
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
      req.flush(
        { message: 'Invalid code' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(error!).toBeTruthy();
      expect(error!.status).toBe(400);
      expect(ctx.authService.isLoginLoading()).toBe(false);
    });

    it('should set isLoginLoading to true during verification', () => {
      ctx.authService.setChellangeId('challenge-123');

      ctx.authService.verifyForgotPasswordOtp('123456').subscribe();

      expect(ctx.authService.isLoginLoading()).toBe(true);

      const req = ctx.httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
      req.flush(mockVerifyOtpResponse);

      expect(ctx.authService.isLoginLoading()).toBe(false);
    });
  });

  describe('Step 3: Create New Password', () => {
    it('should create new password with reset token', () => {
      ctx.tokenService.setResetPasswordToken('reset-token-abc');
      let response: CreateNewPasswordResponse;

      ctx.authService.createNewPassword('NewPassword123!').subscribe((res) => {
        response = res;
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/create-new-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ password: 'NewPassword123!' });
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer reset-token-abc',
      );

      req.flush(mockCreatePasswordResponse);

      expect(response!).toEqual(mockCreatePasswordResponse);
      expect(ctx.authService.isLoginLoading()).toBe(false);
      expect(ctx.tokenService.resetPasswordToken).toBeNull();
    });

    it('should fail if no reset token is present', () => {
      let error: Error;

      ctx.authService.createNewPassword('NewPassword123!').subscribe({
        error: (err) => {
          error = err;
        },
      });

      ctx.httpMock.expectNone(`${baseUrl}/create-new-password`);
      expect(error!).toBeTruthy();
      expect(error!.message).toBe('Missing reset password token');
    });

    it('should handle server error during password creation', () => {
      ctx.tokenService.setResetPasswordToken('reset-token-abc');
      let error: HttpErrorResponse;

      ctx.authService.createNewPassword('NewPassword123!').subscribe({
        error: (err) => {
          error = err;
        },
      });

      const req = ctx.httpMock.expectOne(`${baseUrl}/create-new-password`);
      req.flush(
        { message: 'Token expired' },
        { status: 401, statusText: 'Unauthorized' },
      );

      expect(error!).toBeTruthy();
      expect(error!.status).toBe(401);
      expect(ctx.authService.isLoginLoading()).toBe(false);
      expect(ctx.tokenService.resetPasswordToken).toBeNull();
    });
  });

  describe('Full Flow: Email -> OTP -> New Password', () => {
    it('should complete the entire forgot password flow', () => {
      ctx.authService.forgotPasswordRequest('john@test.com').subscribe();
      const forgotReq = ctx.httpMock.expectOne(`${baseUrl}/forgot-password`);
      forgotReq.flush(mockForgotPasswordResponse);

      expect(ctx.authService.getChallengeId()).toBe('challenge-123');

      ctx.authService.verifyForgotPasswordOtp('123456').subscribe();
      const verifyReq = ctx.httpMock.expectOne(
        `${baseUrl}/forgot-password/verify`,
      );
      verifyReq.flush(mockVerifyOtpResponse);

      expect(ctx.tokenService.resetPasswordToken).toBe('reset-token-abc');

      let finalResponse: CreateNewPasswordResponse;
      ctx.authService
        .createNewPassword('NewPassword123!')
        .subscribe((res) => {
          finalResponse = res;
        });

      const createReq = ctx.httpMock.expectOne(
        `${baseUrl}/create-new-password`,
      );
      createReq.flush(mockCreatePasswordResponse);

      expect(finalResponse!.success).toBe(true);
      expect(ctx.tokenService.resetPasswordToken).toBeNull();
      expect(ctx.authService.isLoginLoading()).toBe(false);
    });
  });
});
