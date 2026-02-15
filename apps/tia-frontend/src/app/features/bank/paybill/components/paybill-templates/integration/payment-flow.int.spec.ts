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
});
