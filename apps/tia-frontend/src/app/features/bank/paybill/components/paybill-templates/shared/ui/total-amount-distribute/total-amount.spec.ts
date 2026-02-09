import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalAmount } from './total-amount';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TotalAmount', () => {
  let component: TotalAmount;
  let fixture: ComponentFixture<TotalAmount>;

  beforeEach(async () => {
    // Enable fake timers for Vitest
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [TotalAmount, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalAmount);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedItemsLength', 1);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate distribution correctly when value is entered', () => {
    fixture.componentRef.setInput('selectedItemsLength', 4);
    component.amountControl.setValue('100');

    // Instantly advance the debounce timer (300ms)
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(25);
  });

  it('should set distribution to 0 when input is cleared', () => {
    component.amountControl.setValue('');

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(0);
  });

  it('should handle zero as input value', () => {
    fixture.componentRef.setInput('selectedItemsLength', 2);
    component.amountControl.setValue('0');

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(0);
  });

  it('should handle non-numeric strings gracefully', () => {
    fixture.componentRef.setInput('selectedItemsLength', 1);
    component.amountControl.setValue('abc');

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(isNaN(component.calculatedDistribution())).toBe(true);
  });
});
