import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardOtpModalContent } from './card-otp-modal-content';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('CardOtpModalContent', () => {
  let component: CardOtpModalContent;
  let fixture: ComponentFixture<CardOtpModalContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOtpModalContent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOtpModalContent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('errorMessage', null);
    fixture.componentRef.setInput('remainingAttempts', 3);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit verifyClicked with OTP code', () => {
    const spy = vi.fn();
    component.verifyClicked.subscribe(spy);

    component.handleVerify({ isCalled: true, otp: '1111' });

    expect(spy).toHaveBeenCalledWith('1111');
  });

  it('should emit cancelClicked', () => {
    const spy = vi.fn();
    component.cancelClicked.subscribe(spy);

    component.handleCancel();

    expect(spy).toHaveBeenCalled();
  });
  it('should not emit verifyClicked when isCalled is false', () => {
    const spy = vi.fn();
    component.verifyClicked.subscribe(spy);

    component.handleVerify({ isCalled: false, otp: '1111' });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit verifyClicked when otp is null', () => {
    const spy = vi.fn();
    component.verifyClicked.subscribe(spy);

    component.handleVerify({ isCalled: true, otp: null });

    expect(spy).not.toHaveBeenCalled();
  });
  it('should emit resendClicked', () => {
    const spy = vi.fn();
    component.resendClicked.subscribe(spy);

    component.handleResend();

    expect(spy).toHaveBeenCalled();
  });

  it('should have otpConfig initialized', () => {
    expect(component.otpConfig).toBeDefined();
    expect(component.otpConfig.iconUrl).toBe(
      '/images/svg/auth/secured-blue.svg',
    );
  });
});
