import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

describe('AuthService (Vitest)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
        provideRouter([]),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    vi.spyOn(tokenService, 'setVerifyToken').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get challengeId', () => {
    service.setChellangeId('123');
    expect(service.getChallengeId()).toBe('123');
  });

  it('should set and get access token', () => {
    service.setTokens('access123', 'refresh123');
    expect(service.getAccessToken()).toBe('access123');
  });

  it('loginPostRequest should handle mfa_required response', (done) => {
    const loginData = { username: 'test@test.com', password: 'password' };
    const mockResponse = { status: 'mfa_required', challengId: 'challenge123' };

    service.loginPostRequest(loginData).subscribe((res) => {
      expect(service.getChallengeId()).toBe('challenge123');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/otp-verify']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('loginPostRequest should handle phone_verification_required response', (done) => {
    const loginData = {
      username: 'test@test.com',
      password: 'password',
    } as any;
    const mockResponse = {
      status: 'phone_verification_required',
      verification_token: 'token123',
    };

    service.loginPostRequest(loginData).subscribe((res) => {
      expect(tokenService.setVerifyToken).toHaveBeenCalledWith('token123');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/phone-verify']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('loginPostRequest should handle error response', (done) => {
    const loginData = {
      username: 'test@test.com',
      password: 'password',
    } as any;
    const mockError = {
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Invalid credentials' },
    };

    service.loginPostRequest(loginData).subscribe({
      error: (err) => {
        expect(service.loginError()).toBe('Invalid credentials');
        expect(service.isLoginLoading()).toBe(false);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockError.error, { status: 401, statusText: 'Unauthorized' });
  });

  it('signUpUser should POST correct data', (done) => {
    const signUpData = { email: 'test@test.com', password: 'password' };
    const mockResponse = { signup_token: 'token123' };

    service.signUpUser(signUpData as any).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('sendVerificationCode should attach the correct Bearer token to headers', () => {
    const phone = '1234567890';
    vi.spyOn(tokenService, 'getSignUpToken', 'get').mockReturnValue(
      'mock-signup-token',
    );

    service.sendVerificationCode(phone).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone`);
    expect(req.request.method).toBe('POST');

    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer mock-signup-token',
    );
    expect(req.request.body).toEqual({ phone });

    req.flush({ success: true });
  });

  it('verifyOtpCode should send challengeId and code in the body', () => {
    const otp = '123456';

    vi.spyOn(tokenService, 'getChallengeId', 'get').mockReturnValue(
      'challenge-789',
    );
    vi.spyOn(tokenService, 'getSignUpToken', 'get').mockReturnValue(
      'mock-signup-token',
    );

    service.verifyOtpCode(otp).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/phone/verify`);

    expect(req.request.body).toEqual({
      challengeId: 'challenge-789',
      code: otp,
    });

    req.flush({ success: true });
  });
});
