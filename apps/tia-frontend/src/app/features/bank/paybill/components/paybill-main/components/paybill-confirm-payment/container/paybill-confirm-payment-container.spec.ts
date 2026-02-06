import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillConfirmPaymentContainer } from './paybill-confirm-payment-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';

describe('PaybillConfirmPaymentContainer', () => {
  let component: PaybillConfirmPaymentContainer;
  let fixture: ComponentFixture<PaybillConfirmPaymentContainer>;
  let facadeMock: any;
  let store: MockStore;

  beforeEach(async () => {
    facadeMock = {
      backToDetails: vi.fn(),
      storeAccounts: signal([]),
      isLoading: signal(false),
      activeProvider: signal({
        id: 'provider-1',
        name: 'Test Provider',
      }),
      paymentPayload: signal({
        identification: { accountNumber: '123456' },
        amount: 100,
        currency: 'GEL',
      }),
      selectedSenderAccountId: signal('sender-123'),
      verifiedDetails: signal({
        subscriberId: '123456',
        customerName: 'John Doe',
        valid: true,
      }),
      activeCategoryUI: signal({
        iconBgColor: '#fff',
        iconBgPath: 'path/to/icon',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillConfirmPaymentContainer, TranslateModule.forRoot()],
      providers: [
        { provide: PaybillMainFacade, useValue: facadeMock },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaybillConfirmPaymentContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch proceedPayment action when confirmPayment is triggered', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.confirmPayment();

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.proceedPayment({
        payload: {
          serviceId: 'provider-1',
          identification: { accountNumber: '123456' },
          amount: 100,
          senderAccountId: 'sender-123',
        },
      }),
    );
  });

  it('should call backToDetails on facade when onBackToDetails is triggered', () => {
    component.onBackToDetails();
    expect(facadeMock.backToDetails).toHaveBeenCalledTimes(1);
  });

  it('should provide the facade to the component instance', () => {
    expect((component as any).facade).toBe(facadeMock);
  });
});
