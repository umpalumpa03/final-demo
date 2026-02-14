import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesGroup,
  selectLoading,
  selectError,
  selectTemplatesLoaded,
  selectTemplateGroupsLoaded,
} from '../../../store/paybill.selectors';
import {
  mockTemplates,
  mockGroups,
  setupIntegrationStore,
} from './integration-test.setup';

describe('Integration: Load Templates & Groups', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
  });

  it('should set loading true on loadTemplates', async () => {
    store.dispatch(TemplatesPageActions.loadTemplates());

    const loading = await firstValueFrom(store.select(selectLoading));
    expect(loading).toBe(true);
  });

  it('should populate templates via selectTemplates', async () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );

    const templates = await firstValueFrom(store.select(selectTemplates));
    expect(templates).toHaveLength(3);
    expect(templates[0].nickname).toBe('Internet Bill');
  });

  it('should mark templates as loaded after success', async () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );

    const loaded = await firstValueFrom(
      store.select(selectTemplatesLoaded),
    );
    expect(loaded).toBe(true);
  });

  it('should populate groups via selectTemplatesGroup', async () => {
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );

    const groups = await firstValueFrom(store.select(selectTemplatesGroup));
    expect(groups).toHaveLength(2);
    expect(groups[0].groupName).toBe('Utilities');
  });

  it('should mark groups as loaded after success', async () => {
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );

    const loaded = await firstValueFrom(
      store.select(selectTemplateGroupsLoaded),
    );
    expect(loaded).toBe(true);
  });

  it('should set error on loadTemplatesFailure', async () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesFailure({
        error: 'Network error',
      }),
    );

    const error = await firstValueFrom(store.select(selectError));
    expect(error).toBe('Network error');
  });
});
