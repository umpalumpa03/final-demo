import { TestBed } from '@angular/core/testing';
import { PaybillDynamicForm } from './paybill-dynamic-form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaybillDynamicField } from './models/dynamic-form.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PaybillDynamicForm', () => {
  let service: PaybillDynamicForm;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaybillDynamicForm],
    });
    service = TestBed.inject(PaybillDynamicForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('syncFormControls', () => {
    it('should add controls without validators if field properties are missing', () => {
      const form = new FormGroup({});
      const fields: PaybillDynamicField[] = [
        { id: 'optionalField', label: 'Optional', type: 'text' } as any,
      ];

      service.syncFormControls(form, fields);

      const control = form.get('optionalField');
      control?.setValue('');
      expect(control?.valid).toBe(true);
    });
  });

  describe('buildIdentification', () => {
    it('should sanitize values to strings and handle null/undefined correctly', () => {
      const rawValues = {
        account: 12345,
        reference: 'REF-01',
        missing: null,
        empty: undefined,
      };

      const result = service.buildIdentification(rawValues);

      expect(result['account']).toBe('12345');
      expect(result['reference']).toBe('REF-01');
      expect(result['missing']).toBeUndefined();
      expect(result['empty']).toBeUndefined();
    });
  });

  describe('updateAmountValidators', () => {
    it('should apply strict validators when isVerified is true', () => {
      const form = new FormGroup({
        amount: new FormControl(0),
      });

      service.updateAmountValidators(form, true);
      const control = form.get('amount');

      control?.setValue(0);
      expect(control?.valid).toBe(false);

      control?.setValue(0.01);
      expect(control?.valid).toBe(true);

      control?.setValue(10000);
      expect(control?.valid).toBe(false);
    });

    it('should apply relaxed validators when isVerified is false', () => {
      const form = new FormGroup({
        amount: new FormControl(0),
      });

      service.updateAmountValidators(form, false);
      const control = form.get('amount');

      control?.setValue(0);
      expect(control?.valid).toBe(true);

      control?.setValue(10000);
      expect(control?.valid).toBe(false);
    });

    it('should return early if the amount control does not exist', () => {
      const emptyForm = new FormGroup({});
      expect(() =>
        service.updateAmountValidators(emptyForm, true),
      ).not.toThrow();
    });
  });
});
