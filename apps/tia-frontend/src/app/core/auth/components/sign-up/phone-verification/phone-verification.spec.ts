import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneVerification } from './phone-verification';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PhoneVerification Component', () => {
  let component: PhoneVerification;
  let fixture: ComponentFixture<PhoneVerification>;
  let authServiceMock: {
    sendPhoneVerificationCode: ReturnType<typeof vi.fn>;
    setChellangeId: ReturnType<typeof vi.fn>;
    otpError: ReturnType<typeof signal>;
  };
  let tokenServiceMock: {
    clearAllToken: ReturnType<typeof vi.fn>;
  };
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authServiceMock = {
      sendPhoneVerificationCode: vi.fn().mockReturnValue(
        of({ challengeId: 'challenge-456' })
      ),
      setChellangeId: vi.fn(),
      otpError: signal(null),
    };

    tokenServiceMock = {
      clearAllToken: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhoneVerification, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} },
          },
        },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneVerification);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should send phone verification code and navigate when isCalled is true', () => {
    const event = {
      isCalled: true,
      otp: '+995555123456',
    };

    component.submit(event);

    expect(authServiceMock.sendPhoneVerificationCode).toHaveBeenCalledWith('+995555123456');
    expect(authServiceMock.setChellangeId).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should handle error when phone verification fails', () => {
    const error = {
      error: {
        message: 'Invalid phone number',
      },
    };

    authServiceMock.sendPhoneVerificationCode.mockReturnValue(
      throwError(() => error)
    );

    const event = {
      isCalled: true,
      otp: '+995555123456',
    };

    component.submit(event);

    expect(authServiceMock.sendPhoneVerificationCode).toHaveBeenCalledWith('+995555123456');
    expect(authServiceMock.setChellangeId).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});