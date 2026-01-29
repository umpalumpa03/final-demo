import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentOptionStep } from './prepayment-option-step';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../../store/loans.actions';
import { selectPrepaymentTypeOptions } from '../../../../store/loans.selectors';
import { ILoan } from '../../../models/loan.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PrepaymentOptionStep', () => {
  let component: PrepaymentOptionStep;
  let fixture: ComponentFixture<PrepaymentOptionStep>;
  let store: MockStore;
  let dispatchSpy: any;

  const mockLoan = {
    id: 'loan-123',
    loanAmount: 5000,
    status: 2,
    purpose: 'personal',
  } as ILoan;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentOptionStep],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectPrepaymentTypeOptions, value: [] }],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PrepaymentOptionStep);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('loan', mockLoan);

    fixture.detectChanges();
  });

  it('should create and dispatch load options on init', () => {
    expect(component).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      LoansActions.loadPrepaymentOptions(),
    );
  });

  describe('Form Reactivity', () => {
    it('should disable amount and calculationOption when type is "full"', () => {
      component.form.controls.type.setValue('full');

      expect(component.form.controls.amount.disabled).toBe(true);
      expect(component.form.controls.calculationOption.disabled).toBe(true);
    });

    it('should enable amount and calculationOption when type is "partial"', () => {
      component.form.controls.type.setValue('full');
      component.form.controls.type.setValue('partial');

      expect(component.form.controls.amount.enabled).toBe(true);
      expect(component.form.controls.calculationOption.enabled).toBe(true);
    });
  });

  describe('onCalculate', () => {
    let emitSpy: any;

    beforeEach(() => {
      emitSpy = vi.spyOn(component.calculate, 'emit');
    });

    it('should not emit if form is invalid and type is not "full"', () => {
      component.form.patchValue({
        type: 'partial',
        amount: null,
        calculationOption: 'reduceMonthlyPayment',
      });

      component.onCalculate();

      expect(component.form.touched).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit correct payload for partial payment', () => {
      component.form.patchValue({
        type: 'partial',
        amount: 1000,
        calculationOption: 'reduceMonthlyPayment',
      });

      component.onCalculate();

      expect(emitSpy).toHaveBeenCalledWith({
        loanId: 'loan-123',
        type: 'partial',
        amount: 1000,
        loanPartialPaymentType: 'reduceMonthlyPayment',
      });
    });

    it('should emit correct payload for full payment', () => {
      component.form.controls.type.setValue('full');
      component.form.controls.amount.setValue(500);

      component.onCalculate();

      expect(emitSpy).toHaveBeenCalledWith({
        loanId: 'loan-123',
        type: 'full',
        amount: undefined,
        loanPartialPaymentType: undefined,
      });
    });

    it('should mark all as touched on invalid submission', () => {
      component.form.controls.type.setValue('');
      component.onCalculate();

      expect(component.form.touched).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
