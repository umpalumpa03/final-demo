import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment';

describe('AuthService Coverage Boost', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRouter = { navigate: vi.fn() };
  const mockTokenService = {
    setVerifyToken: vi.fn(),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    clearAccessToken: vi.fn(),
    getSignUpToken: 'signup-token',
    verifyToken: 'verify-token',
    accessToken: 'access-token'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
        { provide: TokenService, useValue: mockTokenService }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    vi.clearAllMocks();
  });

  afterEach(() => httpMock.verify());

  it('should handle phone_verification_required status', () => {
    service.loginPostRequest({} as any).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ status: 'phone_verification_required', verification_token: 'v-token' });

    expect(mockTokenService.setVerifyToken).toHaveBeenCalledWith('v-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/phone']);
  });

  it('should refresh tokens and update TokenService', () => {
    service.refreshTokenPostRequest({ refresh_token: 'old-rt' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    req.flush({ access_token: 'new-at', refresh_token: 'new-rt' });

    expect(mockTokenService.setAccessToken).toHaveBeenCalledWith('new-at');
    expect(mockTokenService.setRefreshToken).toHaveBeenCalledWith('new-rt');
  });

  it('should clear access token on successful logout', () => {
    service.logout().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush({ success: true });

    expect(mockTokenService.clearAccessToken).toHaveBeenCalled();
  });

  it('should call signup endpoint with user data', () => {
    const userData = { email: 'test@test.com' } as any;
    service.signUpUser(userData).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
    
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush({ success: true });
  });

  it('should handle forgotPasswordRequest and set challengeId', () => {
    service.forgotPasswordRequest('email@test.com').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
    req.flush({ challengeId: 'fp-123' });

    expect(service.getChallengeId()).toBe('fp-123');
  });

  it('should verify forgot password OTP and set new access token', () => {
    service.setChellangeId('fp-123');
    service.verifyForgotPasswordOtp('5555').subscribe();
    
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password/verify`);
    expect(mockTokenService.clearAccessToken).toHaveBeenCalled();
    req.flush({ access_token: 'reset-at' });

    expect(mockTokenService.setAccessToken).toHaveBeenCalledWith('reset-at');
  });

  it('should resend phone OTP using challengeId', () => {
    service.setChellangeId('cid-99');
    service.resetPhoneOtp().subscribe();
    
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.body).toEqual({ challengeId: 'cid-99' });
    req.flush({ success: true });
  });

  it('should throw error if resetPhoneOtp called without challengeId', () => {
    service.setChellangeId(''); 
    service.resetPhoneOtp().subscribe({
      error: (err) => expect(err.message).toBe('Missing forgot password challengeId')
    });
  });

  it('should resend verification code with signup token headers', () => {
    service.setChellangeId('cid-100');
    service.resendVerificationCode().subscribe();
    
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer signup-token');
    req.flush({ success: true });
  });

  // --- PHONE VERIFICATION ---
  it('should send phone verification with combined token logic', () => {
    // This tests the (this.tokenService.getSignUpToken || this.tokenService.verifyToken) logic
    service.sendPhoneVerificationCode('123456789').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone`);
    
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.body).toEqual({ phone: '123456789' });
    req.flush({ success: true });
  });
});