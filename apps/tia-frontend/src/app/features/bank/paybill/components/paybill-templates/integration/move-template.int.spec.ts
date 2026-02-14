import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesAsTreeItems,
} from '../../../store/paybill.selectors';
import {
  mockTemplates,
  mockGroups,
  setupIntegrationStore,
} from './integration-test.setup';

describe('Integration: Move Template Between Groups', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );
  });

  it('should move template to a different group', async () => {
    store.dispatch(
      TemplatesPageActions.moveTemplateSuccess({
        templateId: 't2',
        groupId: 'g2',
        message: 'Moved',
      }),
    );

    const templates = await firstValueFrom(store.select(selectTemplates));
    const moved = templates.find((t) => t.id === 't2');
    expect(moved?.groupId).toBe('g2');
  });

  it('should ungroup a template (move to null)', async () => {
    store.dispatch(
      TemplatesPageActions.moveTemplateSuccess({
        templateId: 't1',
        groupId: null,
        message: 'Ungrouped',
      }),
    );

    const items = await firstValueFrom(
      store.select(selectTemplatesAsTreeItems),
    );
    const ungrouped = items.find((i) => i.id === 't1');
    expect(ungrouped?.groupId).toBeNull();
  });
});
