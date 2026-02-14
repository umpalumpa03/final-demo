import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { ForgotPasswordVerify } from '../forgot-password-verify/forgot-password-verify';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { MonitorInactivity } from '../../../services/monitor-inacticity.service';
import { environment } from '../../../../../../environments/environment';
import { IVerified } from '../../../models/otp-verification.models';
import { ForgotPasswordVerifyResponse } from '../../../models/authResponse.model';

describe('ForgotPasswordVerify Component Integration', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let tokenService: TokenService;
  let router: Router;

  const baseUrl: string = `${environment.apiUrl}/auth`;

  const monitorMock: Partial<MonitorInactivity> = {
    inactivity$: {
      pipe: () => ({ subscribe: () => ({}) }),
    } as MonitorInactivity['inactivity$'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideRouter([]),
        provideStore({}),
        AuthService,
        TokenService,
        { provide: MonitorInactivity, useValue: monitorMock },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should redirect to forgot-password if no challengeId', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    createComponent();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth', 'forgot-password']);
  });

  it('should not redirect if challengeId exists', () => {
    authService.setChellangeId('challenge-123');
    const navigateSpy = vi.spyOn(router, 'navigate');
    createComponent();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should verify OTP and navigate on success', () => {
    authService.setChellangeId('challenge-123');
    const navigateSpy = vi.spyOn(router, 'navigate');
    createComponent();

    const verifyEvent: IVerified = { isCalled: true, otp: '123456' };
    component.verifyResetOtp(verifyEvent);

    const req = httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      challengeId: 'challenge-123',
      code: '123456',
    });

    const mockResponse: ForgotPasswordVerifyResponse = {
      access_token: 'reset-token-abc',
    };
    req.flush(mockResponse);

    expect(navigateSpy).toHaveBeenCalledWith(['/auth', 'reset-password']);
    expect(tokenService.resetPasswordToken).toBe('reset-token-abc');
  });

  it('should set error message on OTP verification failure', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    const verifyEvent: IVerified = { isCalled: true, otp: '000000' };
    component.verifyResetOtp(verifyEvent);

    const req = httpMock.expectOne(`${baseUrl}/forgot-password/verify`);
    req.flush(
      { message: 'Invalid verification code' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(component.errorMessage()).toBe('Invalid verification code');
  });

  it('should not verify when isCalled is false', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    const verifyEvent: IVerified = { isCalled: false, otp: null };
    component.verifyResetOtp(verifyEvent);

    httpMock.expectNone(`${baseUrl}/forgot-password/verify`);
  });

  it('should clear error message on input change', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    component.errorMessage.set('Some error');
    expect(component.errorMessage()).toBe('Some error');

    component.onOtpInputChanged();
    expect(component.errorMessage()).toBeNull();
  });

  it('should not clear error if no error exists', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    expect(component.errorMessage()).toBeNull();
    component.onOtpInputChanged();
    expect(component.errorMessage()).toBeNull();
  });

  it('should resend OTP when called', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    component.resendOtp(true);

    const req = httpMock.expectOne(`${baseUrl}/mfa/otp-resend`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should not resend OTP when isCalled is false', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    component.resendOtp(false);
    httpMock.expectNone(`${baseUrl}/mfa/otp-resend`);
  });

  it('should clear tokens and navigate on backout', () => {
    authService.setChellangeId('challenge-123');
    createComponent();

    const navigateSpy = vi.spyOn(router, 'navigate');
    const clearSpy = vi.spyOn(tokenService, 'clearAllToken');

    component.clearedBackout();

    expect(clearSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/sign-in']);
  });
});
