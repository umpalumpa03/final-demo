import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PaybillOtpVerificationContainer } from './paybill-otp-verification-container';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { vi, describe, it, expect, beforeEach } from 'vitest';

@Component({
  selector: 'app-paybill-otp-verification',
  template: '',
  standalone: true,

  inputs: ['provider', 'summary'],
})
class MockPaybillOtpVerificationComponent {
  @Output() verify = new EventEmitter<string>();
  @Output() cancelPayment = new EventEmitter<void>();
}

describe('PaybillOtpVerificationContainer', () => {
  let component: PaybillOtpVerificationContainer;
  let fixture: ComponentFixture<PaybillOtpVerificationContainer>;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
      activeProvider: signal({ name: 'Test Provider' }),

      paymentPayload: signal({ amount: 100, currency: 'GEL' }),
      backToDetails: vi.fn(),
      verifyOtp: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerificationContainer],
      providers: [{ provide: PaybillMainFacade, useValue: mockFacade }],
    })

      .overrideComponent(PaybillOtpVerificationContainer, {
        remove: { imports: [PaybillOtpVerification] },
        add: { imports: [MockPaybillOtpVerificationComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillOtpVerificationContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call verifyOtp on facade when child emits verify event', () => {
    const otpCode = '123456';
    component.onOtpVerified(otpCode);
    expect(mockFacade.verifyOtp).toHaveBeenCalledWith(otpCode);
  });

  it('should call backToDetails on facade when child emits cancelPayment event', () => {
    component.onBackToDetails();
    expect(mockFacade.backToDetails).toHaveBeenCalled();
  });
});
