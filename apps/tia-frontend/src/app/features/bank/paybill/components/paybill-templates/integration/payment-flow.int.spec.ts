import { describe, it, expect, beforeEach } from 'vitest';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectSelectedTemplates,
  selectDistributedAmount,
  selectTotalAmount,
  selectFormPayload,
  selectSelectedSenderAccountId,
  selectChallengeId,
  selectIsFormValid,
} from '../../../store/paybill.selectors';
import { mockTemplates, createStore } from './integration-test.setup';

describe('Integration: Payment Flow', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
  });

  it('should track selected items via addCheckedItems', () => {
    store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: [mockTemplates[0], mockTemplates[2]],
      }),
    );

    const selected = store.select(selectSelectedTemplates);
    expect(selected).toHaveLength(2);
    expect(selected.map((s) => s.id)).toEqual(['t1', 't3']);
  });

  it('should track distributed and total amounts', () => {
    store.dispatch(
      TemplatesPageActions.setDistributedAmount({ amount: 75 }),
    );
    store.dispatch(TemplatesPageActions.setTotalAmount({ amount: 150 }));

    expect(store.select(selectDistributedAmount)).toBe(75);
    expect(store.select(selectTotalAmount)).toBe(150);
  });

  it('should store payments form payload', () => {
    const payments = [
      {
        serviceId: 'svc-internet',
        identification: { accountNumber: '111' },
        amount: 50,
        senderAccountId: 'acc-1',
      },
      {
        serviceId: 'svc-elec',
        identification: { accountNumber: '333' },
        amount: 100,
        senderAccountId: 'acc-1',
      },
    ];

    store.dispatch(TemplatesPageActions.setPaymentsForm({ payments }));

    const form = store.select(selectFormPayload);
    expect(form).toHaveLength(2);
    expect(form[0].serviceId).toBe('svc-internet');
    expect(form[1].amount).toBe(100);
  });

  it('should store sender account id', () => {
    store.dispatch(
      TemplatesPageActions.setSenderId({
        selectedSenderAccountId: 'acc-main',
      }),
    );

    expect(store.select(selectSelectedSenderAccountId)).toBe('acc-main');
  });

  it('should set challengeId on payManyBillsSuccess', () => {
    store.dispatch(
      TemplatesPageActions.payManyBillsSuccess({
        response: { verify: { challengeId: 'ch-123' } } as any,
      }),
    );

    expect(store.select(selectChallengeId)).toBe('ch-123');
  });

  it('should track form validity', () => {
    store.dispatch(TemplatesPageActions.setFormValid({ isValid: true }));

    expect(store.select(selectIsFormValid)).toBe(true);
  });

  it('should clear payment info (items, amounts)', () => {
    store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: [mockTemplates[0]],
      }),
    );
    store.dispatch(
      TemplatesPageActions.setDistributedAmount({ amount: 50 }),
    );
    store.dispatch(TemplatesPageActions.setTotalAmount({ amount: 100 }));

    store.dispatch(TemplatesPageActions.clearPaymentInfo());

    expect(store.select(selectSelectedTemplates)).toHaveLength(0);
    expect(store.select(selectDistributedAmount)).toBe(0);
    expect(store.select(selectTotalAmount)).toBe(0);
  });
});
