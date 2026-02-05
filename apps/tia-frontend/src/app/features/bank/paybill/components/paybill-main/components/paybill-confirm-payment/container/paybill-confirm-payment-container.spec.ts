import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillConfirmPaymentContainer } from './paybill-confirm-payment-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PaybillConfirmPaymentContainer', () => {
  let component: PaybillConfirmPaymentContainer;
  let fixture: ComponentFixture<PaybillConfirmPaymentContainer>;
  let facadeMock: any;

  beforeEach(async () => {
    facadeMock = {
      // 🔹 METHODS used in container
      confirmPayment: vi.fn(),
      backToDetails: vi.fn(),
      storeAccounts: vi.fn(() => []),

      // 🔹 SIGNALS used directly or indirectly by template/children
      activeProvider: signal({
        id: 'provider-1',
        name: 'Test Provider',
      }),

      paymentPayload: signal({
        amount: 100,
        currency: 'GEL',
      }),

      selectedSenderAccount: signal({
        iban: 'GE00TB123456789',
        name: 'Main Account',
      }),

      verifiedDetails: signal({
        subscriberId: '123456',
        customerName: 'John Doe',
      }),

      activeCategoryUI: signal({
        icon: 'electricity',
        title: 'Utilities',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillConfirmPaymentContainer, TranslateModule.forRoot()],
      providers: [{ provide: PaybillMainFacade, useValue: facadeMock }],
      schemas: [NO_ERRORS_SCHEMA], // ignore child component templates
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillConfirmPaymentContainer);
    component = fixture.componentInstance;

    // 🚀 This used to crash — now all computeds have valid data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirmPayment on facade when onFinalConfirm is triggered', () => {
    component.onFinalConfirm();
    expect(facadeMock.confirmPayment).toHaveBeenCalledTimes(1);
  });

  it('should call backToDetails on facade when onBackToDetails is triggered', () => {
    component.onBackToDetails();
    expect(facadeMock.backToDetails).toHaveBeenCalledTimes(1);
  });

  it('should provide the facade to the component instance', () => {
    expect((component as any).facade).toBe(facadeMock);
  });
});
