import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockTokenService = {
    setVerifyToken: vi.fn(),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    clearAccessToken: vi.fn(),
    getSignUpToken: 'fake-signup-token',
    verifyToken: 'fake-verify-token',
    accessToken: 'fake-access-token'
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

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle MFA requirement correctly', () => {
    const mockRes = { status: 'mfa_required', challengeId: '123' };
    const loginData = { password: '123' } as any; 
    
    service.loginPostRequest(loginData).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockRes);

    expect(service.getChallengeId()).toBe('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/otp-verify']);
  });

  it('should update loginError signal on request failure', () => {
    const loginData = { password: '123' } as any;

    service.loginPostRequest(loginData).subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.loginError()).toBe('Invalid credentials');
    expect(service.isLoginLoading()).toBe(false);
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBe(true);

    vi.spyOn(mockTokenService, 'accessToken', 'get').mockReturnValue(null as any);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should update tokens on successful MFA verification', () => {
    const mockVerifyRes = { access_token: 'new_at', refresh_token: 'new_rt' };
    
    service.verifyMfa({ code: '123456', challengeId: 'cid' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/verify`);
    req.flush(mockVerifyRes);

    expect(mockTokenService.setAccessToken).toHaveBeenCalledWith('new_at');
    expect(mockTokenService.setRefreshToken).toHaveBeenCalledWith('new_rt');
  });

  it('should throw error in createNewPassword if token is missing', () => {
    vi.spyOn(mockTokenService, 'accessToken', 'get').mockReturnValue(null as any);

    service.createNewPassword('pass').subscribe({
      error: (err) => {
        expect(err.message).toBe('Missing forgot password access token');
      }
    });
  });

  it('should verify OTP code with headers', () => {
    service.setChellangeId('123');
    service.verifyOtpCode('654321').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone/verify`);
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.body).toEqual({ challengeId: '123', code: '654321' });
    req.flush({});
  });
});