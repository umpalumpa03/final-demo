import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PaybillOtpVerificationContainer } from './paybill-otp-verification-container';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';

@Component({
  selector: 'app-paybill-otp-verification',
  template: '',
  standalone: true,
  inputs: [
    'provider',
    'summary',
    'isLoading',
    'iconBgColor',
    'iconBgPath',
    'errorMessage',
  ],
})
class MockPaybillOtpVerificationComponent {
  @Output() verify = new EventEmitter<string>();
  @Output() cancelPayment = new EventEmitter<void>();
}

describe('PaybillOtpVerificationContainer', () => {
  let component: PaybillOtpVerificationContainer;
  let fixture: ComponentFixture<PaybillOtpVerificationContainer>;
  let mockFacade: any;
  let store: MockStore;

  beforeEach(async () => {
    mockFacade = {
      activeProvider: signal({ name: 'Test Provider' }),
      paymentPayload: signal({
        amount: 100,
        identification: { accountNumber: '123' },
      }),
      isLoading: signal(false),
      challengeId: signal<string | null>('chal-123'),

      activeCategoryUI: signal({
        iconBgColor: '#F0F9FF',
        iconBgPath: 'assets/icons/utilities.svg',
      }),

      backToDetails: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerificationContainer],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        provideMockStore(),
      ],
    })
      .overrideComponent(PaybillOtpVerificationContainer, {
        remove: { imports: [PaybillOtpVerification] },
        add: { imports: [MockPaybillOtpVerificationComponent] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaybillOtpVerificationContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call backToDetails on facade when onBackToDetails is triggered', () => {
    component.onBackToDetails();
    expect(mockFacade.backToDetails).toHaveBeenCalled();
  });

  describe('verifyOtp', () => {
    it('should dispatch confirmPayment action when challengeId exists', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const otpCode = '123456';

      component.verifyOtp(otpCode);

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.confirmPayment({
          payload: { challengeId: 'chal-123', code: otpCode },
        }),
      );
    });

    it('should NOT dispatch action if challengeId is missing', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      mockFacade.challengeId.set(null);

      component.verifyOtp('123456');

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
