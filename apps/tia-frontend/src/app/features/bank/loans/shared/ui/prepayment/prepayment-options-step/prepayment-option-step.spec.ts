import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentOptionStep } from './prepayment-option-step';
import { LoansStore } from '../../../../store/loans.store';
import { ILoan } from '../../../models/loan.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';

describe('PrepaymentOptionStep', () => {
  let component: PrepaymentOptionStep;
  let fixture: ComponentFixture<PrepaymentOptionStep>;
  let loansStoreMock: any;

  const mockLoan = {
    id: 'loan-123',
    loanAmount: 5000,
    status: 2,
    purpose: 'personal',
  } as ILoan;

  beforeEach(async () => {
    loansStoreMock = {
      prepaymentTypeOptions: signal([]),
      loadPrepaymentOptions: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PrepaymentOptionStep, TranslateModule.forRoot()],
      providers: [{ provide: LoansStore, useValue: loansStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentOptionStep);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('loan', mockLoan);
    fixture.detectChanges();
  });

  it('should create and load options', () => {
    expect(component).toBeTruthy();
    expect(loansStoreMock.loadPrepaymentOptions).toHaveBeenCalled();
  });
  it('should emit calculation payload', () => {
    const emitSpy = vi.spyOn(component.calculate, 'emit');
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
});
