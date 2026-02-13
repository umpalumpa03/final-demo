import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsList } from './bills-list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  selectDistributedAmount,
  selectSelectedSenderAccountId,
  selectSelectedTemplates,
} from '../../../../../store/paybill.selectors';
import { TemplatesPageActions } from '../../../../../store/paybill.actions';

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
      imports: [BillsList, ReactiveFormsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedTemplates, value: mockTemplates },
            { selector: selectDistributedAmount, value: 0 },
            { selector: selectSelectedSenderAccountId, value: 'acc-123' },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Set required input before first detectChanges
    fixture.componentRef.setInput('isDistribution', false);
    fixture.detectChanges();
  });

  it('should initialize form controls based on store templates', () => {
    expect(component.payForm.contains('1')).toBe(true);
    expect(component.payForm.get('1')?.value).toBe('100.00');
    expect(Object.keys(component.payForm.controls).length).toBe(2);
  });

  it('should disable controls when isDistribution input is true', async () => {
    fixture.componentRef.setInput('isDistribution', true);
    fixture.detectChanges();

    // Wait for the effect to propagate to the UI
    await fixture.whenStable();

    expect(component.payForm.get('1')?.disabled).toBe(true);
  });

  it('should update all amounts when distributedAmount changes to a non-zero value', async () => {
    store.overrideSelector(selectDistributedAmount, 50.5);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.payForm.get('1')?.value).toBe('50.50');
    expect(component.payForm.get('2')?.value).toBe('50.50');
  });

  it('should correctly format the payload via buildPayload', () => {
    const payload = component.buildPayload();

    expect(payload).toEqual([
      {
        serviceId: 's1',
        identification: 'id1',
        amount: 100,
        senderAccountId: 'acc-123',
      },
      {
        serviceId: 's2',
        identification: 'id2',
        amount: 200,
        senderAccountId: 'acc-123',
      },
    ]);
  });

  it('should block "e" and "-" keys in preventNegative', () => {
    const preventSpy = vi.fn();
    const mockEvent = {
      key: '-',
      preventDefault: preventSpy,
    } as unknown as KeyboardEvent;

    component.preventNegative(mockEvent);
    expect(preventSpy).toHaveBeenCalled();

    preventSpy.mockClear();
    component.preventNegative({
      key: '1',
      preventDefault: preventSpy,
    } as unknown as KeyboardEvent);
    expect(preventSpy).not.toHaveBeenCalled();
  });
});
