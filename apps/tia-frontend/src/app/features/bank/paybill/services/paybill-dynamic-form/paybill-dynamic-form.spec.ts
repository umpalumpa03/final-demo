import { TestBed } from '@angular/core/testing';
import { PaybillDynamicForm } from './paybill-dynamic-form';
import { FormControl, FormGroup } from '@angular/forms';
import { PaybillDynamicField } from './models/dynamic-form.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  selectPaymentFields,
  selectVerifiedDetails,
} from '../../store/paybill.selectors';
import { signal } from '@angular/core';

describe('PaybillDynamicForm', () => {
  let service: PaybillDynamicForm;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaybillDynamicForm, provideMockStore()],
    });
    service = TestBed.inject(PaybillDynamicForm);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('syncFormControls', () => {
    it('should add controls with correct validators', () => {
      const form = new FormGroup({});
      const fields: PaybillDynamicField[] = [
        { id: 'f1', required: true, minLength: 5, maxLength: 10 } as any,
      ];

      service.syncFormControls(form, fields);

      const control = form.get('f1');
      expect(control).toBeDefined();
      control?.setValue('123');
      expect(control?.valid).toBe(false);
    });
  });

  describe('mapFieldToConfig', () => {
    it('should map field to InputConfig correctly', () => {
      const field: PaybillDynamicField = {
        label: 'Test Label',
        placeholder: 'Test Placeholder',
        required: true,
        minLength: 5,
      } as any;

      const config = service.mapFieldToConfig(field);
      expect(config.label).toBe('Test Label');
      expect(config.required).toBe(true);
    });
  });

  describe('syncFormWithPaymentFields', () => {
    it('should patch amountDue if verified and amountValidator is true', () => {
      const form = new FormGroup({ amount: new FormControl(0) });
      const mockFields = [{ id: 'acc', required: true }] as any;
      const mockDetails = { valid: true, amountDue: 150 };

      vi.spyOn(store, 'selectSignal').mockImplementation((selector) => {
        if (selector === selectPaymentFields) return signal(mockFields);
        if (selector === selectVerifiedDetails) return signal(mockDetails);
        return signal(null);
      });

      service.syncFormWithPaymentFields(form, {}, true);

      expect(form.get('amount')?.value).toBe(150);
      expect(form.contains('acc')).toBe(true);
    });
  });
  describe('updateAmountValidators', () => {
    it('should return early if amount control does not exist', () => {
      const form = new FormGroup({});

      service.updateAmountValidators(form, true);

      expect(form.contains('amount')).toBe(false);
    });

    it('should set validators with min when isVerified is true', () => {
      const form = new FormGroup({
        amount: new FormControl(0),
      });

      service.updateAmountValidators(form, true);

      const amountControl = form.get('amount');
      amountControl?.setValue(0);
      expect(amountControl?.valid).toBe(false);

      amountControl?.setValue(0.01);
      expect(amountControl?.valid).toBe(true);
    });

    it('should set validators without min when isVerified is false', () => {
      const form = new FormGroup({
        amount: new FormControl(0),
      });

      service.updateAmountValidators(form, false);

      const amountControl = form.get('amount');
      amountControl?.setValue(0);
      expect(amountControl?.valid).toBe(true);
    });

    it('should enforce max validator of 9999', () => {
      const form = new FormGroup({
        amount: new FormControl(0),
      });

      service.updateAmountValidators(form, true);

      const amountControl = form.get('amount');
      amountControl?.setValue(10000);
      expect(amountControl?.valid).toBe(false);

      amountControl?.setValue(9999);
      expect(amountControl?.valid).toBe(true);
    });

    it('should remove extra controls and reset static fields to initial values', () => {
      const initialFields = { amount: 0 };
      const form = new FormGroup({
        amount: new FormControl(500),
        extraField: new FormControl('test'),
      });

      service.resetFormToInitialState(form, initialFields);

      expect(form.contains('extraField')).toBe(false);

      expect(form.contains('amount')).toBe(true);
      expect(form.get('amount')?.value).toBe(0);
    });

    it('should convert values to strings and sanitize null/undefined to undefined', () => {
      const formValues = {
        accountNumber: 12345,
        param1: 'some-value',
        emptyField: null,
        missingField: undefined,
      };

      const result = service.buildIdentification(formValues);

      expect(result).toEqual({
        accountNumber: '12345',
        param1: 'some-value',
        emptyField: undefined,
        missingField: undefined,
      });
    });
  });
});
