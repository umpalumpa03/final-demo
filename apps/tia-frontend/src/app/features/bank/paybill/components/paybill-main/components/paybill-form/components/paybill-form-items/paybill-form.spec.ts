import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillForm } from './paybill-form';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PaybillProvider,
  BillDetails,
} from '../../../../shared/models/paybill.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PaybillForm', () => {
  let component: PaybillForm;
  let fixture: ComponentFixture<PaybillForm>;
  let fb: FormBuilder;

  const mockProvider: PaybillProvider = {
    id: 'test-provider',
    serviceName: 'Test Service',
    categoryId: 'utilities',
    name: 'Test Provider',
  };

  beforeEach(async () => {
    fb = new FormBuilder();
    const nonNullableFb = fb.nonNullable;

    await TestBed.configureTestingModule({
      imports: [PaybillForm, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NonNullableFormBuilder, useValue: nonNullableFb },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillForm);
    component = fixture.componentInstance;

    const mockForm = fb.group({
      value: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
    });

    fixture.componentRef.setInput('paybillForm', mockForm);
    fixture.componentRef.setInput('fields', []);
    fixture.componentRef.setInput('provider', mockProvider);

    fixture.detectChanges();
  });

  it('should create and initialize the form with default values', () => {
    expect(component).toBeTruthy();
    expect(component.paybillForm()).toBeDefined();
    expect(component.paybillForm().controls['value'].value).toBe('');
  });

  describe('onSubmit logic', () => {
    it('should not emit if isLoading is true', () => {
      const verifySpy = vi.spyOn(component.verify, 'emit');
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      component.paybillForm().setValue({ value: '123456', amount: 10 });
      component.onSubmit();

      expect(verifySpy).not.toHaveBeenCalled();
    });

    describe('Verification Phase (Not Verified)', () => {
      it('should emit verify event if identifier is valid', () => {
        const verifySpy = vi.spyOn(component.verify, 'emit');

        component.paybillForm().controls['value'].setValue('123456');
        component.paybillForm().controls['amount'].setValue(10);

        component.onSubmit();

        expect(verifySpy).toHaveBeenCalledWith(
          expect.objectContaining({
            value: expect.objectContaining({ value: '123456' }),
          }),
        );
      });

      it('should mark control as touched if identifier is invalid', () => {
        const verifySpy = vi.spyOn(component.verify, 'emit');

        component.paybillForm().controls['value'].setErrors({ required: true });

        const touchedSpy = vi.spyOn(
          component.paybillForm(),
          'markAllAsTouched',
        );

        component.onSubmit();

        expect(verifySpy).not.toHaveBeenCalled();
        expect(touchedSpy).toHaveBeenCalled();
      });
    });

    describe('Payment Phase (Verified)', () => {
      const mockVerified: BillDetails = {
        valid: true,
        accountHolder: 'John Doe',
        amountDue: 150,
        address: 'Main St',
        dueDate: '2025-01-01',
        isExactAmount: false,
      };

      beforeEach(() => {
        fixture.componentRef.setInput('verifiedDetails', mockVerified);
        fixture.detectChanges();
      });

      it('should return true for isVerified computed signal', () => {
        expect(component.isVerified()).toBe(true);
      });

      it('should emit pay event if form is valid', () => {
        const paySpy = vi.spyOn(component.pay, 'emit');

        component.paybillForm().setValue({ value: '123456', amount: 100 });

        component.onSubmit();

        expect(paySpy).toHaveBeenCalledWith({
          amount: 100,
          value: expect.objectContaining({ value: '123456', amount: 100 }),
        });
      });

      it('should not emit pay event if amount is invalid', () => {
        const paySpy = vi.spyOn(component.pay, 'emit');

        component.paybillForm().setValue({ value: '123456', amount: 0 });

        component.onSubmit();

        expect(paySpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('Summary Items', () => {
    it('should calculate summary items when verified details are provided', () => {
      const mockVerified: BillDetails = {
        valid: true,
        accountHolder: 'Jane Doe',
        amountDue: 200,
        address: 'Second St',
        dueDate: '2025-02-02',
        isExactAmount: true,
      };

      fixture.componentRef.setInput('verifiedDetails', mockVerified);
      fixture.detectChanges();

      const summary = component['summaryItems']();
      expect(summary.length).toBeGreaterThan(0);
      expect(summary.some((s) => s.value === 'Jane Doe')).toBe(true);
    });
  });
});
