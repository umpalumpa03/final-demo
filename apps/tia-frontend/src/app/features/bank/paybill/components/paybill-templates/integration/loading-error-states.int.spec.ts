import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import {
  selectLoading,
  selectError,
  selectSelectedSenderAccountId,
} from '../../../store/paybill.selectors';
import { setupIntegrationStore } from './integration-test.setup';

describe('Integration: Loading & Error States', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
  });

  it('should set loading on CRUD operations and clear on success', async () => {
    store.dispatch(
      TemplatesPageActions.deleteTemplate({ templateId: 't1' }),
    );

    let loading = await firstValueFrom(store.select(selectLoading));
    expect(loading).toBe(true);

    store.dispatch(
      TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't1',
        message: 'ok',
      }),
    );

    loading = await firstValueFrom(store.select(selectLoading));
    expect(loading).toBe(false);
  });

  it('should set error on failure and clear on clearError', async () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateFailure({
        error: 'Rename failed',
      }),
    );

    let error = await firstValueFrom(store.select(selectError));
    expect(error).toBe('Rename failed');

    store.dispatch(PaybillActions.clearError());

    error = await firstValueFrom(store.select(selectError));
    expect(error).toBeNull();
  });

  it('should clear selection and reset related state', async () => {
    store.dispatch(
      TemplatesPageActions.setSenderId({
        selectedSenderAccountId: 'acc-1',
      }),
    );

    store.dispatch(PaybillActions.clearSelection());

    const id = await firstValueFrom(
      store.select(selectSelectedSenderAccountId),
    );
    expect(id).toBeNull();
  });
});
