import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDistribution } from './payment-distribution';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TemplatesPageActions } from '../../../../../store/paybill.actions';
import { selectDistributedAmount } from '../../../../../store/paybill.selectors';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PaymentDistribution', () => {
  let component: PaymentDistribution;
  let fixture: ComponentFixture<PaymentDistribution>;
  let store: MockStore;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [PaymentDistribution],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectDistributedAmount, value: 0 }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDistribution);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.componentRef.setInput('selectedItemsLength', 2);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change distribution mode to equal and emit true', () => {
    const emitSpy = vi.spyOn(component.isDistribution, 'emit');
    const controlSpy = vi.spyOn(component.amountControl, 'setValue');

    component.onDistributionChange('equal');

    expect(component.distributionMode()).toBe('equal');
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(controlSpy).toHaveBeenCalledWith('');
  });

  it('should change distribution mode to individual and emit false', () => {
    const emitSpy = vi.spyOn(component.isDistribution, 'emit');

    component.onDistributionChange('individual');

    expect(component.distributionMode()).toBe('individual');
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should dispatch total and distributed amounts after debounce', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.amountControl.setValue('100');

    vi.advanceTimersByTime(300);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setTotalAmount({ amount: 100 }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setDistributedAmount({ amount: 50 }),
    );
  });

  it('should handle null/empty values by dispatching 0', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.amountControl.setValue(null);
    vi.advanceTimersByTime(300);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setTotalAmount({ amount: 0 }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setDistributedAmount({ amount: 0 }),
    );
  });

  it('should use default divisor of 1 if selectedItemsLength is undefined', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture.componentRef.setInput('selectedItemsLength', undefined);

    component.amountControl.setValue('50');
    vi.advanceTimersByTime(300);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setDistributedAmount({ amount: 50 }),
    );
  });
});
