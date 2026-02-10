import { TestBed } from '@angular/core/testing';
import { BillsList } from './bills-list';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  selectDistributedAmount,
  selectSelectedTemplates,
} from '../../../../../store/paybill.selectors';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentRef } from '@angular/core';

describe('BillsList', () => {
  let component: BillsList;
  let fixture: any;
  let store: MockStore;
  let componentRef: ComponentRef<BillsList>;

  const mockTemplates = [
    { id: '1', amountDue: 100 },
    { id: '2', amountDue: 50 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsList, ReactiveFormsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedTemplates, value: mockTemplates },
            { selector: selectDistributedAmount, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    componentRef = fixture.componentRef;

    componentRef.setInput('isDistribution', false);

    fixture.detectChanges();
  });

  it('should create form controls based on selected items', () => {
    expect(component.payForm.contains('1')).toBe(true);
    expect(component.payForm.contains('2')).toBe(true);
    expect(component.payForm.get('1')?.value).toBe('100.00');
  });

  it('should disable controls when isDistribution is true', () => {
    componentRef.setInput('isDistribution', true);
    fixture.detectChanges();

    expect(component.payForm.get('1')?.disabled).toBe(true);
  });

  it('should update control values when distributedAmount changes', () => {
    store.overrideSelector(selectDistributedAmount, 75);
    store.refreshState();
    fixture.detectChanges();

    expect(component.payForm.get('1')?.value).toBe('75.00');
    expect(component.payForm.get('2')?.value).toBe('75.00');
  });

  it('should revert to amountDue when distributedAmount is 0', () => {
    store.overrideSelector(selectDistributedAmount, 75);
    store.refreshState();
    fixture.detectChanges();
    store.overrideSelector(selectDistributedAmount, 0);
    store.refreshState();
    fixture.detectChanges();

    expect(component.payForm.get('1')?.value).toBe('100.00');
  });
});
