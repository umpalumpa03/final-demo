import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerification, TranslateModule.forRoot()],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('type', 'sign-in');
    
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
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
    
    expect(emitSpy).toHaveBeenCalledWith({
      isCalled: true,
      otp: '9876'
    });
  });

  it('should emit phone number on submit when timerType is phone', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');

    component.setPhoneNumberForm.setValue({ phoneNumber: '512345678' });
    component.setPhoneNumberForm.updateValueAndValidity();
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      isCalled: true,
      otp: '512345678'
    });
  });

  it('should set submitError when form is invalid and clear after timeout', () => {
    vi.useFakeTimers();

    component.onSubmit();

    expect(component.submitError()).toBe('Please check the required fields.');

    vi.advanceTimersByTime(5000);
    expect(component.submitError()).toBe('');

    vi.useRealTimers();
  });

  it('should compute unitedError and allow retry when errors are set', () => {
    fixture.componentRef.setInput('errorMessage', 'Invalid code');
    fixture.componentRef.setInput('remainingAttempts', 2);
    fixture.componentRef.setInput('onErrorRedirect', true);
    fixture.detectChanges();

    expect(component.unitedError()).toContain('Invalid code');
    expect(component.unitedError()).toContain('Remaining attempts: 2');
    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should disable button when phoneErrorMessage is set', () => {
    fixture.componentRef.setInput('phoneErrorMessage', 'Invalid phone');
    fixture.detectChanges();

    expect(component.isButtonDisabled()).toBe(true);
  });

  it('should emit resend when countdown is 0 and reset timer', () => {
    const emitSpy = vi.spyOn(component.isResendCalled, 'emit');

    expect(emitSpy).toHaveBeenCalledWith(true);
  });
});
