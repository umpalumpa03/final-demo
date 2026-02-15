import { describe, it, expect, beforeEach } from 'vitest';

import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import {
  selectLoading,
  selectError,
  selectSelectedSenderAccountId,
} from '../../../store/paybill.selectors';
import { createStore } from './integration-test.setup';

describe('Integration: Loading & Error States', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('should set loading on CRUD operations and clear on success', () => {
    store.dispatch(
      TemplatesPageActions.deleteTemplate({ templateId: 't1' }),
    );

    expect(store.select(selectLoading)).toBe(true);

    store.dispatch(
      TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't1',
        message: 'ok',
      }),
    );

    expect(store.select(selectLoading)).toBe(false);
  });

  it('should set error on failure and clear on clearError', () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateFailure({
        error: 'Rename failed',
      }),
    );

    expect(store.select(selectError)).toBe('Rename failed');

    store.dispatch(PaybillActions.clearError());

    expect(store.select(selectError)).toBeNull();
  });

  it('should clear selection and reset related state', () => {
    store.dispatch(
      TemplatesPageActions.setSenderId({
        selectedSenderAccountId: 'acc-1',
      }),
    );

    store.dispatch(PaybillActions.clearSelection());

    expect(store.select(selectSelectedSenderAccountId)).toBeNull();
  });
});
