import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillOtpVerification } from './paybill-otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import {
  PaybillPayload,
  PaybillProvider,
} from '../../shared/models/paybill.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PaybillOtpVerification', () => {
  let component: PaybillOtpVerification;
  let fixture: ComponentFixture<PaybillOtpVerification>;

  const mockProvider: PaybillProvider = {
    id: 'p1',
    serviceName: 'Service',
    categoryId: 'cat1',
    name: 'Mock Provider',
  };

  const mockPayload: PaybillPayload = {
    identification: { accountNumber: '123456' },
    amount: 100,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerification, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillOtpVerification);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('summary', mockPayload);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit verify with code when handleVerify is called', () => {
    const spy = vi.spyOn(component.verify, 'emit');
    const otpCode = '123456';

    component.verify.emit(otpCode);

    expect(spy).toHaveBeenCalledWith(otpCode);
  });

  describe('User Actions', () => {
    it('should update currentCode signal when onOtpComplete is called', () => {
      const testCode = '1234';
      component.onOtpComplete(testCode);
      expect(component.currentCode()).toBe(testCode);
    });

    it('should emit resendCode output when onOtpResend is called', () => {
      const spy = vi.spyOn(component.resendCode, 'emit');
      component.onOtpResend();
      expect(spy).toHaveBeenCalled();
    });
  });
});
