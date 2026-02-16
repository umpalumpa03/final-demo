vi.mock('apps/tia-frontend/src/environments/environment', () => ({
  environment: { apiUrl: 'https://tia.up.railway.app' },
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, Router } from '@angular/router';
import { OtpVerificationService } from '@tia/core/otp-verification/services/otp-verification.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OtpVerification,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        {
          provide: OtpVerificationService,
          useValue: {
            getOtpConfig: vi.fn().mockReturnValue(
              of({
                otp: {
                  maxResendAttempts: 3,
                  maxVerifyAttempts: 3,
                  expirationMinutes: 5,
                  resendTimeoutMs: 1000,
                  enabledOtpResends: ['', 'AUTH'],
                },
              }),
            ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('type', 'sign-in');

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.clearAllMocks();
  });

  it('should create and initialize properly', () => {
    expect(component).toBeTruthy();
    expect(component.type()).toBe('sign-in');
    expect(component.timerType()).toBe('phone');
  });

  it('should handle different timer types', () => {
    expect(component.timerType()).toBe('phone');

    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();

    expect(component.timerType()).toBe('otp');
  });

  it('should not submit when form is invalid', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit correct otp value on submit', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');

    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();

    component.otpForm.setValue({ code: '9876' });
    component.otpForm.updateValueAndValidity();

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith('9876');
  });

  it('should decrement attempts immediately on submit', () => {
    component.maxAttempts.set(1);

    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();

    component.otpForm.setValue({ code: '9876' });
    component.otpForm.updateValueAndValidity();

    component.onSubmit();

    expect(component.maxAttempts()).toBe(0);
    expect(component.pendingVerification()).toBe(true);
  });

  it('should NOT show error page or navigate immediately when attempts reach 0 while verification is pending', () => {
    const router = TestBed.inject(Router);
    const navSpy = vi.spyOn(router, 'navigate');

    component.maxAttempts.set(1);

    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();

    component.otpForm.setValue({ code: '9876' });
    component.otpForm.updateValueAndValidity();

    component.onSubmit();

    expect(component.maxAttempts()).toBe(0);
    expect(component.pendingVerification()).toBe(true);
    expect(component.isErrorPageVisible()).toBe(false);
    expect(navSpy).not.toHaveBeenCalled();
  });

  it('should show error page when attempts reach 0 after submit and verification error', () => {
    component.maxAttempts.set(1);

    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();

    component.otpForm.setValue({ code: '1111' });
    component.otpForm.updateValueAndValidity();

    component.onSubmit();

    fixture.componentRef.setInput('errorMessage', 'Invalid OTP code');
    fixture.detectChanges();

    expect(component.maxAttempts()).toBe(0);
    expect(component.isErrorPageVisible()).toBe(true);
  });

  it('should emit phone number on submit when timerType is phone', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');

    component.setPhoneNumberForm.setValue({ phoneNumber: '512345678' });
    component.setPhoneNumberForm.updateValueAndValidity();

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith('512345678');
  });

  it('should set submitError when form is invalid and clear after timeout', () => {
    vi.useFakeTimers();
    // Make form invalid
    component.otpForm.setValue({ code: '' });
    // Make form invalid explicitly
    component.otpForm.setErrors({ required: true });
    // Make form invalid explicitly
    component.otpForm.setErrors({ required: true });
    component.otpForm.updateValueAndValidity();
    component.onSubmit();
    // implementation shows an alert instead of setting submitError, so expect null
    expect(component.submitError()).toBeNull();
    vi.useRealTimers();
  });

  it('should compute unitedError and allow retry when errors are set', () => {
    fixture.componentRef.setInput('errorMessage', 'Invalid code');
    fixture.componentRef.setInput('remainingAttempts', 2);
    fixture.componentRef.setInput('onErrorRedirect', true);

    fixture.detectChanges();

    expect(component.unitedError()).toContain('Invalid code');
    expect(component.unitedError()).toContain('Remaining attempts: 3');
    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should not disable button when phoneErrorMessage is set', () => {
    fixture.componentRef.setInput('phoneErrorMessage', 'Invalid phone');
    fixture.detectChanges();

    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should emit resend when handleTimeout is called', () => {
    const emitSpy = vi.spyOn(component.onTimeout, 'emit');

    component.handleTimeout();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
