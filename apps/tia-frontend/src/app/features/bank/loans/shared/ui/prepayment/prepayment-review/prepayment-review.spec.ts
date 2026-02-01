import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentReview } from './prepayment-review';
import { IPrepaymentCalcResponse } from '../../../models/prepayment.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('PrepaymentReview', () => {
  let component: PrepaymentReview;
  let fixture: ComponentFixture<PrepaymentReview>;

  const mockCalculationResult = {
    monthlyPayment: 500,
    totalInterest: 100,
    newBalance: 4000,
    displayedInfo: [
      { text: 'Monthly Payment: 500 GEL' },
      { text: 'Total Interest: 100 USD' },
      { text: 'Remaining Balance' },
      { text: 'Processing Fee' },
    ],
  } as unknown as IPrepaymentCalcResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentReview, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentReview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('calculationResult', mockCalculationResult);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept custom isLoading input', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });

  it('should accept custom currencyCode input', () => {
    fixture.componentRef.setInput('currencyCode', 'USD');
    fixture.detectChanges();
    expect(component.currencyCode()).toBe('USD');
  });

  it('should emit cancel event', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit confirmPay event', () => {
    const spy = vi.spyOn(component.confirmPay, 'emit');
    component.confirmPay.emit();
    expect(spy).toHaveBeenCalled();
  });
});
