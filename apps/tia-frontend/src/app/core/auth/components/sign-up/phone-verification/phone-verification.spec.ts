import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneVerification } from './phone-verification';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('PhoneVerification', () => {
  let component: PhoneVerification;
  let fixture: ComponentFixture<PhoneVerification>;
  let authService: AuthService;
  let tokenService: TokenService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneVerification],
      providers: [
        {
          provide: AuthService,
          useValue: {
            sendVerificationCode: () => of({ challengeId: 'mock-id' }),
          },
        },
        {
          provide: TokenService,
          useValue: {
            setChallengeId: () => {},
            getSignUpToken: 'fake-token',
          },
        },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneVerification);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.sendVerificationCode on submit', () => {
    const spy = vi.spyOn(authService, 'sendVerificationCode');
    component.setPhoneNumberForm.controls.phoneNumber.setValue('123456789');

    component.submit();

    expect(spy).toHaveBeenCalledWith('123456789');
  });

  it('should store challengeId and navigate on success', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    const tokenSpy = vi.spyOn(tokenService, 'setChallengeId');
    
    vi.spyOn(authService, 'sendVerificationCode').mockReturnValue(
      of({ challengeId: 'new-challenge-123' } as any)
    );

    component.setPhoneNumberForm.controls.phoneNumber.setValue('5551234');
    component.submit();

    expect(tokenSpy).toHaveBeenCalledWith('new-challenge-123');
    expect(navSpy).toHaveBeenCalledWith(['/auth/otp']);
  });

  it('should handle error when sendVerificationCode fails', () => {
    const mockError = {
      error: {
        message: ['Invalid phone number format'],
      },
    };

    vi.spyOn(authService, 'sendVerificationCode')
      .mockReturnValue(throwError(() => mockError));

    component.setPhoneNumberForm.controls.phoneNumber.setValue('invalid-number');
    component.submit();

    expect(component.errorMessage()).toBe('Invalid phone number format');
  });
});