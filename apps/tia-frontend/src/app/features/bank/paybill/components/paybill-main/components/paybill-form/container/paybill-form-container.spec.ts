import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, EventEmitter, Output, Input } from '@angular/core';
import { PaybillFormContainer } from './paybill-form-container';
import { PaybillForm } from '../components/paybill-form-items/paybill-form';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { PaybillDynamicForm } from '../../../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';

@Component({
  selector: 'app-paybill-form',
  template: '',
  standalone: true,
  inputs: ['provider', 'verifiedDetails', 'iconBgColor', 'iconBgPath'],
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

  beforeEach(async () => {
    mockFacade = {
      activeProvider: signal({ name: 'Test', id: '1' }),
      verifiedDetails: signal(null),
      activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: '' }),
      paymentFields: signal([]),
      isLoading: signal(false),
      verifyAccount: vi.fn(),
      proceedToPayment: vi.fn(),
      saveAsTemplate: vi.fn(),
    };

    mockDynamicForm = {
      syncFormControls: vi.fn(),
      updateAmountValidators: vi.fn(),
      buildIdentification: vi.fn((val) => ({ transformed: val })),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillFormContainer, ReactiveFormsModule],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: PaybillDynamicForm, useValue: mockDynamicForm },
      ],
    })
      .overrideComponent(PaybillFormContainer, {
        remove: { imports: [PaybillForm] },
        add: { imports: [MockPaybillFormComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillFormContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call verifyAccount on facade with transformed identification', () => {
    const eventData = { value: '123' };
    component.onVerifyAccount(eventData as any);

    expect(mockDynamicForm.buildIdentification).toHaveBeenCalledWith('123');

    expect(mockFacade.verifyAccount).toHaveBeenCalledWith({
      transformed: '123',
    });
  });

  it('should call proceedToPayment on facade with amount and transformed identification', () => {
    const eventData = { value: '456', amount: 100 };
    component.onProceedToPayment(eventData as any);

    expect(mockDynamicForm.buildIdentification).toHaveBeenCalledWith('456');
    expect(mockFacade.proceedToPayment).toHaveBeenCalledWith(100, {
      transformed: '456',
    });
  });
});
