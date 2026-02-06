import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, EventEmitter, Output } from '@angular/core';
import { PaybillFormContainer } from './paybill-form-container';
import { PaybillForm } from '../components/paybill-form-items/paybill-form';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { PaybillDynamicForm } from '../../../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../../../store/paybill.actions';

@Component({
  selector: 'app-paybill-form',
  template: '',
  standalone: true,
  inputs: [
    'provider',
    'verifiedDetails',
    'iconBgColor',
    'iconBgPath',
    'paybillForm',
    'fields',
    'isLoading',
  ],
})
class MockPaybillFormComponent {
  @Output() verify = new EventEmitter<any>();
  @Output() pay = new EventEmitter<any>();
}

describe('PaybillFormContainer', () => {
  let component: PaybillFormContainer;
  let fixture: ComponentFixture<PaybillFormContainer>;
  let mockFacade: any;
  let mockDynamicForm: any;
  let store: MockStore;

  beforeEach(async () => {
    mockFacade = {
      activeProvider: signal({ name: 'Test Provider', id: '1' }),
      verifiedDetails: signal(null),
      activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: '' }),
      paymentFields: signal([]),
      paymentPayload: signal({ identification: { accountNumber: '123' } }),
      isLoading: signal(false),
    };

    mockDynamicForm = {
      syncFormControls: vi.fn(),
      updateAmountValidators: vi.fn(),
      buildIdentification: vi.fn((val) => ({ accountNumber: val })),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillFormContainer, ReactiveFormsModule],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: PaybillDynamicForm, useValue: mockDynamicForm },
        provideMockStore(),
        provideRouter([]),
      ],
    })
      .overrideComponent(PaybillFormContainer, {
        remove: { imports: [PaybillForm] },
        add: { imports: [MockPaybillFormComponent] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaybillFormContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Account Verification', () => {
    it('should dispatch checkBill and setPaymentPayload on onVerifyAccount', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const eventData = { value: '123' };

      component.onVerifyAccount(eventData as any);

      expect(mockDynamicForm.buildIdentification).toHaveBeenCalledWith('123');
      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.checkBill({
          serviceId: '1',
          identification: { accountNumber: '123' },
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.setPaymentPayload({
          data: { identification: { accountNumber: '123' }, amount: 0 },
        }),
      );
    });
  });

  describe('Template Management', () => {
    it('should dispatch createTemplate action on onSaveAsTemplate', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const nickname = 'My Custom Template';

      component.onSaveAsTemplate(nickname);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.createTemplate({
          serviceId: '1',
          identification: { accountNumber: '123' },
          nickname: nickname,
        }),
      );
    });

    it('should use provider name as fallback nickname if none provided', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      component.saveAsTemplate();

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: 'Test Provider',
        }),
      );
    });

    it('should return early and NOT dispatch if provider or payload is missing', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      mockFacade.activeProvider.set(null);

      component.saveAsTemplate();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Payment Processing', () => {
    it('should dispatch transaction and payload actions on onProceedToPayment', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const eventData = { value: '456', amount: 100 };

      component.onProceedToPayment(eventData as any);

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.setTransactionProvider({
          provider: mockFacade.activeProvider(),
        }),
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'CONFIRM' }),
      );
    });
  });

  describe('Form Synchronization (Effect)', () => {
    it('should call dynamic form sync methods when payment fields update', () => {
      mockFacade.paymentFields.set([{ id: 'test' }]);
      fixture.detectChanges();

      expect(mockDynamicForm.syncFormControls).toHaveBeenCalled();
      expect(mockDynamicForm.updateAmountValidators).toHaveBeenCalled();
    });
  });
});
