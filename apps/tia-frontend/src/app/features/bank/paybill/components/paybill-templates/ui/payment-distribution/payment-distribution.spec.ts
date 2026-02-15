import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDistribution } from './payment-distribution';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TemplatesPageActions } from '../../../../store/paybill.actions';
import {
  selectDistributedAmount,
  selectSelectedTemplates,
} from '../../../../store/paybill.selectors';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PaymentDistribution', () => {
  let component: PaymentDistribution;
  let fixture: ComponentFixture<PaymentDistribution>;
  let store: MockStore;
  let mockEvent: any;
  const mockTemplates = [
    { id: 1, amountDue: 100 },
    { id: 2, amountDue: 200 },
  ];

  beforeEach(async () => {
    vi.useFakeTimers();

    mockEvent = {
      key: '',
      target: { value: '' },
      preventDefault: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PaymentDistribution,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
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

    store.refreshState();
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

    it('should dispatch distributed amount in equal mode', () => {
      component.onDistributionChange('equal');
      component.amountControl.setValue('100');

      vi.advanceTimersByTime(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.setDistributedAmount({ amount: 50 }),
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

    it('should prevent "e" and "-" keys', () => {
      ['e', '-'].forEach((key) => {
        mockEvent.key = key;
        component.preventNegativeInput(mockEvent as KeyboardEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        vi.clearAllMocks();
      });
    });

    it('should allow navigation and deletion keys', () => {
      ['Backspace', 'Delete', 'ArrowLeft', 'Tab'].forEach((key) => {
        mockEvent.key = key;
        component.preventNegativeInput(mockEvent as KeyboardEvent);
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        vi.clearAllMocks();
      });
    });

    it('should prevent input if first digit is 0 and another digit is typed', () => {
      mockEvent.target.value = '0';
      mockEvent.key = '5';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent more than 5 digits in the integer part', () => {
      mockEvent.target.value = '12345';
      mockEvent.key = '6';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should allow decimals even if integer part is at max length', () => {
      mockEvent.target.value = '12345';
      mockEvent.key = '.';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent more than one decimal separator', () => {
      mockEvent.target.value = '10.5';
      mockEvent.key = '.';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should prevent more than 2 decimal places', () => {
      mockEvent.target.value = '10.55';
      mockEvent.key = '6';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should allow typing digits if they are within limits', () => {
      mockEvent.target.value = '12';
      mockEvent.key = '3';
      component.preventNegativeInput(mockEvent as KeyboardEvent);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});
