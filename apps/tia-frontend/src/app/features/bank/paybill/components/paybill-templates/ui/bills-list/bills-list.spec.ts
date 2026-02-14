import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsList } from './bills-list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectDistributedAmount,
  selectSelectedSenderAccountId,
  selectSelectedTemplates,
} from '../../../../store/paybill.selectors';
import { TemplatesPageActions } from '../../../../store/paybill.actions';

describe('BillsList', () => {
  let component: BillsList;
  let fixture: ComponentFixture<BillsList>;
  let store: MockStore;

  const mockTemplates = [
    { id: '1', serviceId: 's1', identification: 'id1', amountDue: 100 },
    { id: '2', serviceId: 's2', identification: 'id2', amountDue: 200 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsList, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedTemplates, value: mockTemplates },
            { selector: selectDistributedAmount, value: 0 },
            { selector: selectSelectedSenderAccountId, value: 'acc-123' },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.componentRef.setInput('isDistribution', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form controls and dispatch total amount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    // Check form controls
    expect(component.payForm.contains('1')).toBe(true);
    expect(component.payForm.get('1')?.value).toBe('100.00');

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setTotalAmount({ amount: 300 }),
    );
  });

  it('should update all amounts when distributedAmount changes', () => {
    store.overrideSelector(selectDistributedAmount, 50.5);
    store.refreshState();
    fixture.detectChanges();

    expect(component.payForm.get('1')?.value).toBe('50.50');
    expect(component.payForm.get('2')?.value).toBe('50.50');
  });

  it('should dispatch new total when a form value changes', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const control = component.payForm.get('1');

    if (control) {
      (control as any).setValue('150.00');
    }

    await fixture.whenStable();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.setTotalAmount({ amount: 350 }),
    );
  });

  describe('preventNegative logic', () => {
    let preventSpy: any;

    beforeEach(() => {
      preventSpy = vi.fn();
    });

    const createMockEvent = (key: string, value: string) =>
      ({
        key,
        target: { value } as HTMLInputElement,
        preventDefault: preventSpy,
      }) as unknown as KeyboardEvent;

    it('should prevent negative sign', () => {
      component.preventNegative(createMockEvent('-', ''));
      expect(preventSpy).toHaveBeenCalled();
    });

    it('should prevent more than 5 digits in integer part', () => {
      component.preventNegative(createMockEvent('6', '12345'));
      expect(preventSpy).toHaveBeenCalled();
    });

    it('should allow digits if within length limit', () => {
      component.preventNegative(createMockEvent('6', '123'));
      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should prevent more than two decimal places', () => {
      component.preventNegative(createMockEvent('5', '10.55'));
      expect(preventSpy).toHaveBeenCalled();
    });

    it('should allow decimals if only one digit exists', () => {
      component.preventNegative(createMockEvent('5', '10.5'));
      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should allow navigation keys (Backspace, Tab, etc)', () => {
      component.preventNegative(createMockEvent('Backspace', '123456'));
      expect(preventSpy).not.toHaveBeenCalled();
    });
  });

  it('should correctly format the payload via buildPayload', () => {
    const payload = component.buildPayload();
    expect(payload[0]).toMatchObject({
      serviceId: 's1',
      amount: 100,
      senderAccountId: 'acc-123',
    });
  });
});
