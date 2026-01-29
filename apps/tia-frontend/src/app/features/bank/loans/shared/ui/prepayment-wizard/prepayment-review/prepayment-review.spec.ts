import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentReview } from './prepayment-review';
import { IPrepaymentCalcResponse } from '../../../models/prepayment.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PrepaymentReview', () => {
  let component: PrepaymentReview;
  let fixture: ComponentFixture<PrepaymentReview>;

  const mockCalculationResult = {
    monthlyPayment: 500,
    totalInterest: 100,
    newBalance: 4000,
  } as unknown as IPrepaymentCalcResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentReview],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentReview);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('calculationResult', mockCalculationResult);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the calculationResult input', () => {
    expect(component.calculationResult()).toEqual(mockCalculationResult);
  });

  it('should initialize cancel output', () => {
    expect(component.cancel).toBeTruthy();
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should initialize confirmPay output', () => {
    expect(component.confirmPay).toBeTruthy();
    const spy = vi.spyOn(component.confirmPay, 'emit');
    component.confirmPay.emit();
    expect(spy).toHaveBeenCalled();
  });
});
