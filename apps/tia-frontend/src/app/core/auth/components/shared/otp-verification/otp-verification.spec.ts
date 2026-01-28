import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;
  let authServiceMock: {
    verifyMfa: ReturnType<typeof vi.fn>;
    getChallengeId: ReturnType<typeof vi.fn>;
    isLoginLoading: ReturnType<typeof signal>;
  };
  let authService: AuthService;
  let router: Router;

  const createComponent = (path: 'sign-in' | 'sign-up') => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { url: [{ path }] } }
    });

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  };

  beforeEach(async () => {
    authServiceMock = {
      verifyMfa: vi.fn().mockReturnValue(of({})),
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      isLoginLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [OtpVerification],
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { url: [{ path: 'sign-in' }] } },
        },
      ],
    }).compileComponents();
  });

  it('should initialize with sign-in logic when path is sign-in', () => {
    createComponent('sign-in');
    expect(component['registerVerifyLogic']()).toBe(false);
  });

  it('should initialize with sign-up logic when path is sign-up', () => {
    createComponent('sign-up');
    expect(component['registerVerifyLogic']()).toBe(true);
  });

  it('should handle login logic (console log) when path is sign-in', () => {
    createComponent('sign-in');
    const consoleSpy = vi.spyOn(console, 'log');
    
    component.submit();
      });

  it('should not call API and mark form touched if verificationCode is invalid', () => {
    createComponent('sign-up');
    const authSpy = vi.spyOn(authService, 'verifyOtpCode');
    
    component.submit();

    expect(component.smsCodeVerificationForm.touched).toBe(true);
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('should navigate to success page on successful verification', () => {
    createComponent('sign-up');
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(authService, 'verifyOtpCode').mockReturnValue(of({ success: true } as any));

    component.smsCodeVerificationForm.controls.verificationCode.setValue('1234');
    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/success']);
  });
});