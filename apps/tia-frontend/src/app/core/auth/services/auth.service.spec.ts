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
import { firstValueFrom } from 'rxjs';

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
    vi.spyOn(tokenService, 'setAccessToken').mockImplementation(() => {});
    vi.spyOn(tokenService, 'setRefreshToken').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loginPostRequest should handle mfa_required response', (done) => {
    const loginData = { username: 'test@test.com', password: 'password' };
    const mockResponse = { status: 'mfa_required', challengId: 'challenge123' };

    service.loginPostRequest(loginData).subscribe((res) => {
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
      expect(router.navigate).toHaveBeenCalledWith(['/auth/phone']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('verifyMfa should set tokens and navigate on success', (done) => {
    const verifyBody = { code: '1111', challengeId: 'challenge123' } as any;
    const mockResponse = { access_token: 'access123', refresh_token: 'refresh123' } as any;

    service.verifyMfa(verifyBody).subscribe((res) => {
      expect(tokenService.setAccessToken).toHaveBeenCalledWith('access123');
      expect(tokenService.setRefreshToken).toHaveBeenCalledWith('refresh123');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/verify`);
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

  it('forgotPasswordRequest should store challengeId from response', () => {
    const challengeSpy = vi.spyOn(service, 'setChellangeId');

    service.forgotPasswordRequest('test@test.com').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com' });

    req.flush({ challengeId: 'challenge-321' });
    expect(challengeSpy).toHaveBeenCalledWith('challenge-321');
  });

  it('verifyForgotPasswordOtp should clear access token and set new access token', () => {
    const clearSpy = vi.spyOn(tokenService, 'clearAccessToken');
    const setSpy = vi.spyOn(tokenService, 'setAccessToken');
    vi.spyOn(service, 'getChallengeId').mockReturnValue('challenge-123');

    service.verifyForgotPasswordOtp('1234').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/forgot-password/verify`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      challengeId: 'challenge-123',
      code: '1234',
    });

    expect(clearSpy).toHaveBeenCalled();
    req.flush({ access_token: 'new-access' });
    expect(setSpy).toHaveBeenCalledWith('new-access');
  });

  it('createNewPassword should throw when access token missing', async () => {
    await expect(
      firstValueFrom(service.createNewPassword('Pass123!')),
    ).rejects.toThrow('Missing forgot password access token');
  });

  it('createNewPassword should attach bearer token', () => {
    localStorage.setItem('access_token', 'fp-token');

    service.createNewPassword('Pass123!').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/create-new-password`,
    );
    expect(req.request.headers.get('Authorization')).toBe('Bearer fp-token');
    expect(req.request.body).toEqual({ password: 'Pass123!' });

    req.flush({ success: true });
  });

  it('resetPhoneOtp should throw when challengeId is missing', async () => {
    await expect(firstValueFrom(service.resetPhoneOtp())).rejects.toThrow(
      'Missing forgot password challengeId',
    );
  });

  it('resetPhoneOtp should use challengeId in payload', () => {
    service.setChellangeId('challenge-555');

    service.resetPhoneOtp().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ challengeId: 'challenge-555' });

    req.flush({ success: true });
  });
});
