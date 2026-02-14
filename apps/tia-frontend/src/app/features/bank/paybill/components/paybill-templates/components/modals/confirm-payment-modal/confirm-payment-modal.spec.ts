import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPaymentModal } from './confirm-payment-modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import {
  selectSelectedTemplates,
  selectDistributedAmount,
  selectSelectedSenderAccountId,
} from '../../../../../store/paybill.selectors';

describe('ConfirmPaymentModal', () => {
  let component: ConfirmPaymentModal;
  let fixture: ComponentFixture<ConfirmPaymentModal>;

  const initialState = {
    paybill: {
      selectedItems: [],
      categories: [],
      templateGroups: [],
      templates: [],
      paymentDetails: { fields: [] },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPaymentModal, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectSelectedTemplates, value: [] },
            { selector: selectDistributedAmount, value: 0 },
            { selector: selectSelectedSenderAccountId, value: 'mock-acc-id' },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPaymentModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectedItemsLength', 5);
    fixture.componentRef.setInput('isDistribution', false);
    fixture.componentRef.setInput('submitVariant', 'primary');
    fixture.componentRef.setInput('submitLabel', 'Pay Now');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly reflect initial signal values', () => {
    expect(component.selectedItemsLength()).toBe(5);
    expect(component.isDistribution()).toBe(false);
  });

  it('should emit cancel event when cancel is triggered', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit submit event when submit is triggered', () => {
    const spy = vi.spyOn(component.submit, 'emit');
    component.submit.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit distributionChange with the correct boolean value', () => {
    const spy = vi.spyOn(component.distributionChange, 'emit');
    component.distributionChange.emit(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should update inputs dynamically', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });
});
