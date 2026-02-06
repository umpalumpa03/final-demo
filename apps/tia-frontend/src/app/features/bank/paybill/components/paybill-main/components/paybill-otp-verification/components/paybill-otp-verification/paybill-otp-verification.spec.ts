import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillOtpVerification } from './paybill-otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import {
  PaybillPayload,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
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
      providers: [provideRouter([])],
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

  describe('Summary Items Calculation', () => {
    it('should calculate summary items correctly based on inputs', () => {
      const items = component['summaryItems']();

      expect(items.length).toBe(3);
      expect(items[0].value).toBe('Mock Provider');
      expect(items[1].value).toBe('123456');
      expect(items[2].value).toBe('100');
    });

    it('should fallback to serviceName if provider name is missing', () => {
      fixture.componentRef.setInput('provider', {
        ...mockProvider,
        name: undefined,
      });
      fixture.detectChanges();

      const items = component['summaryItems']();
      expect(items[0].value).toBe('Service');
    });
  });

  describe('User Actions & Events', () => {
    it('should update currentCode signal when onOtpComplete is called', () => {
      const testCode = '1234';
      component.onOtpComplete(testCode);
      expect(component.currentCode()).toBe(testCode);
    });

    it('should emit verify with code when onVerify is called with valid event', () => {
      const spy = vi.spyOn(component.verify, 'emit');
      const mockEvent = { isCalled: true, otp: '123456' };

      component.onVerify(mockEvent as any);

      expect(spy).toHaveBeenCalledWith('123456');
    });

    it('should NOT emit verify if the event is invalid', () => {
      const spy = vi.spyOn(component.verify, 'emit');

      component.onVerify({ isCalled: false } as any);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit cancelPayment when onCancel is called', () => {
      const spy = vi.spyOn(component.cancelPayment, 'emit');
      component.onCancel();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit resendCode when onResend is called', () => {
      const spy = vi.spyOn(component.resendCode, 'emit');
      component.onResend();
      expect(spy).toHaveBeenCalled();
    });
  });
});
