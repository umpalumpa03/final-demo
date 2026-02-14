import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

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
import { mockTemplates, setupIntegrationStore } from './integration-test.setup';

describe('Integration: Payment Flow', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
  });

  it('should track selected items via addCheckedItems', async () => {
    store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: [mockTemplates[0], mockTemplates[2]],
      }),
    );

    const selected = await firstValueFrom(
      store.select(selectSelectedTemplates),
    );
    expect(selected).toHaveLength(2);
    expect(selected.map((s) => s.id)).toEqual(['t1', 't3']);
  });

  it('should track distributed and total amounts', async () => {
    store.dispatch(
      TemplatesPageActions.setDistributedAmount({ amount: 75 }),
    );
    store.dispatch(TemplatesPageActions.setTotalAmount({ amount: 150 }));

    const distributed = await firstValueFrom(
      store.select(selectDistributedAmount),
    );
    expect(distributed).toBe(75);

    const total = await firstValueFrom(store.select(selectTotalAmount));
    expect(total).toBe(150);
  });

  it('should store payments form payload', async () => {
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

    const form = await firstValueFrom(store.select(selectFormPayload));
    expect(form).toHaveLength(2);
    expect(form[0].serviceId).toBe('svc-internet');
    expect(form[1].amount).toBe(100);
  });

  it('should store sender account id', async () => {
    store.dispatch(
      TemplatesPageActions.setSenderId({
        selectedSenderAccountId: 'acc-main',
      }),
    );

    const id = await firstValueFrom(
      store.select(selectSelectedSenderAccountId),
    );
    expect(id).toBe('acc-main');
  });

  it('should set challengeId on payManyBillsSuccess', async () => {
    store.dispatch(
      TemplatesPageActions.payManyBillsSuccess({
        response: { verify: { challengeId: 'ch-123' } } as any,
      }),
    );

    const challengeId = await firstValueFrom(
      store.select(selectChallengeId),
    );
    expect(challengeId).toBe('ch-123');
  });

  it('should track form validity', async () => {
    store.dispatch(TemplatesPageActions.setFormValid({ isValid: true }));

    const valid = await firstValueFrom(store.select(selectIsFormValid));
    expect(valid).toBe(true);
  });

  it('should clear payment info (items, amounts)', async () => {
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

    const items = await firstValueFrom(
      store.select(selectSelectedTemplates),
    );
    expect(items).toHaveLength(0);

    const distributed = await firstValueFrom(
      store.select(selectDistributedAmount),
    );
    expect(distributed).toBe(0);

    const total = await firstValueFrom(store.select(selectTotalAmount));
    expect(total).toBe(0);
  });
});
