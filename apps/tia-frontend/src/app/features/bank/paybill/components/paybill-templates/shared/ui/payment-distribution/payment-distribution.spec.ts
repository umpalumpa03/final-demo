import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDistribution } from './payment-distribution';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TemplatesPageActions } from '../../../../../store/paybill.actions';
import {
  selectDistributedAmount,
  selectSelectedTemplates,
} from '../../../../../store/paybill.selectors';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PaymentDistribution', () => {
  let component: PaymentDistribution;
  let fixture: ComponentFixture<PaymentDistribution>;
  let store: MockStore;

  const mockTemplates = [
    { id: 1, amountDue: 100 },
    { id: 2, amountDue: 200 },
  ];

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [PaymentDistribution, ReactiveFormsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectDistributedAmount, value: 0 },
            { selector: selectSelectedTemplates, value: mockTemplates },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDistribution);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.componentRef.setInput('selectedItemsLength', 2);

    fixture.detectChanges();

    vi.advanceTimersByTime(300);

    vi.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDistributionChange', () => {
    it('should update mode and emit state', () => {
      const emitSpy = vi.spyOn(component.isDistribution, 'emit');

      component.onDistributionChange('equal');

      expect(component.distributionMode()).toBe('equal');
      expect(emitSpy).toHaveBeenCalledWith(true);
      expect(component.amountControl.value).toBe('');
    });
  });

  describe('Reactive Logic (Value Changes)', () => {
    it('should dispatch full bill value in individual mode', () => {
      component.onDistributionChange('individual');
      component.amountControl.setValue('50');

      vi.advanceTimersByTime(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.setTotalAmount({ amount: 300 }),
      );
    });

    it('should dispatch 0 distributed amount when input is empty', () => {
      component.amountControl.setValue('50');
      vi.advanceTimersByTime(300);

      vi.mocked(store.dispatch).mockClear();

      component.amountControl.setValue('');
      vi.advanceTimersByTime(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.setDistributedAmount({ amount: 0 }),
      );
    });
  });

  describe('Keyboard Events', () => {
    it('should prevent negative and exponential characters', () => {
      const preventDefault = vi.fn();
      const eventMinus = {
        key: '-',
        preventDefault,
      } as unknown as KeyboardEvent;
      const eventE = { key: 'e', preventDefault } as unknown as KeyboardEvent;
      const eventNum = { key: '5', preventDefault } as unknown as KeyboardEvent;

      component.preventNegative(eventMinus);
      component.preventNegative(eventE);
      expect(preventDefault).toHaveBeenCalledTimes(2);

      preventDefault.mockClear();
      component.preventNegative(eventNum);
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
