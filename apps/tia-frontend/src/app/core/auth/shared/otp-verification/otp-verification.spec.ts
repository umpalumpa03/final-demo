import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';

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
    
    // Set required inputs
    fixture.componentRef.setInput('type', 'sign-in');
    
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and initialize properly', () => {
    expect(component).toBeTruthy();
    expect(component.type()).toBe('sign-in');
    expect(component.timeLimit()).toBe(1);
    expect(component.timerType()).toBe('phone');
  });

  it('should initialize form with empty code and required validator', () => {
    expect(component.otpForm.get('code')?.value).toBe('');
    expect(component.otpForm.get('code')?.hasError('required')).toBe(true);
  });

  it('should set countdown to maxTime on init', () => {
    component.ngOnInit();
    expect(component.countdown()).toBe(60); // 1 minute * 60 seconds
  });

  it('should calculate maxTime correctly with custom timeLimit', () => {
    fixture.componentRef.setInput('timeLimit', 3);
    fixture.detectChanges();
    
    expect(component.maxTime()).toBe(180); // 3 minutes * 60 seconds
  });

  it('should handle negative timeLimit by taking absolute value', () => {
    fixture.componentRef.setInput('timeLimit', -2);
    fixture.detectChanges();
    
    expect(component.maxTime()).toBe(120); // abs(-2) * 60 = 120 seconds
  });

  it('should initialize signals with correct default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.submitError()).toBeNull();
    expect(component.isResendActive()).toBe(false);
    expect(component.phoneConfig()).toEqual({ label: 'Phone Number' });
    expect(component.otpConfig()).toEqual({ length: 4, label: 'Verification Code' });
  });

  it('should compute config properties from type input', () => {
    const config = component.config();
    expect(config).toBeDefined();
    expect(component.iconUrl()).toBeDefined();
    expect(component.title()).toBeDefined();
    expect(component.subText()).toBeDefined();
    expect(component.submitBtnName()).toBeDefined();
    expect(component.backLink()).toBeDefined();
    expect(component.backLinkText()).toBeDefined();
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

  it('should emit isVerifyCalled when form is valid', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');
    
    component.otpForm.patchValue({ code: '1234' });
    component.onSubmit();
    
    expect(emitSpy).toHaveBeenCalledWith({
      isCalled: true,
      otp: '1234'
    });
  });

  it('should emit correct otp value on submit', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');
    
    component.otpForm.patchValue({ code: '9876' });
    component.onSubmit();
    
    expect(emitSpy).toHaveBeenCalledWith({
      isCalled: true,
      otp: '9876'
    });
  });

  it('should not resend when countdown is active', () => {
    const emitSpy = vi.spyOn(component.isResendCalled, 'emit');
    
    component.countdown.set(30);
    component.onResend();
    
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit isResendCalled when countdown is 0', () => {
    const emitSpy = vi.spyOn(component.isResendCalled, 'emit');
    
    component.countdown.set(0);
    component.onResend();
    
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should reset countdown to maxTime on resend', () => {
    component.countdown.set(0);
    const maxTime = component.maxTime();
    
    component.onResend();
    
    expect(component.countdown()).toBe(maxTime);
  });

  it('should disable resend button after resend', () => {
    component.countdown.set(0);
    component.isResendActive.set(true);
    
    component.onResend();
    
    expect(component.isResendActive()).toBe(false);
  });

  it('should render form when not loading', () => {
    component.isLoading.set(false);
    fixture.detectChanges();
    
    const form = fixture.debugElement.query(By.css('.auth-form'));
    expect(form).toBeTruthy();
  });

  it('should render spinner when loading', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    
    const spinner = fixture.debugElement.query(By.css('app-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display submit error when present', () => {
    component.submitError.set('auth.errors.invalid-code');
    fixture.detectChanges();
    
    const error = fixture.debugElement.query(By.css('.auth-error'));
    expect(error).toBeTruthy();
  });

  it('should render otp field when timerType is otp', () => {
    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();
    
    const otpField = fixture.debugElement.query(By.css('.otp-field'));
    expect(otpField).toBeTruthy();
  });

  it('should render phone field when timerType is phone', () => {
    fixture.componentRef.setInput('timerType', 'phone');
    fixture.detectChanges();
    
    const phoneField = fixture.debugElement.query(By.css('.otp-field__phone'));
    expect(phoneField).toBeTruthy();
  });

  it('should show timer countdown value', () => {
    component.countdown.set(45);
    fixture.detectChanges();
    
    const timerValue = fixture.debugElement.query(By.css('.timer-compact__value'));
    expect(timerValue?.nativeElement?.textContent?.trim()).toBe('45');
  });

  it('should add pulse class when countdown is active', () => {
    component.countdown.set(30);
    fixture.detectChanges();
    
    const statusDot = fixture.debugElement.query(By.css('.timer-compact__status-dot'));
    expect(statusDot?.nativeElement?.classList?.contains('timer-compact__status-dot--pulse')).toBe(true);
  });

  it('should not add pulse class when countdown is 0', () => {
    component.countdown.set(0);
    fixture.detectChanges();
    
    const statusDot = fixture.debugElement.query(By.css('.timer-compact__status-dot'));
    expect(statusDot?.nativeElement?.classList?.contains('timer-compact__status-dot--pulse')).toBe(false);
  });

  it('should enable resend when countdown reaches 0', () => {
    component.countdown.set(1);
    
    // Simulate countdown reaching 0
    component.countdown.set(0);
    fixture.detectChanges();
    
    // Effect should trigger setting isResendActive to true
    expect(component.isResendActive()).toBe(true);
  });

  it('should handle edge cases for form validation', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');
    
    // Test with null value
    component.otpForm.patchValue({ code: null as any });
    component.onSubmit();
    expect(emitSpy).not.toHaveBeenCalled();
    
    // Test with empty string
    component.otpForm.patchValue({ code: '' });
    component.onSubmit();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle timeLimit of 0', () => {
    fixture.componentRef.setInput('timeLimit', 0);
    fixture.detectChanges();
    
    expect(component.maxTime()).toBe(0);
  });

});
