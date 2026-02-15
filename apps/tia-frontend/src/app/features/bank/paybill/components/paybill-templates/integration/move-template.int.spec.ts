import { describe, it, expect, beforeEach } from 'vitest';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesAsTreeItems,
} from '../../../store/paybill.selectors';
import {
  mockTemplates,
  mockGroups,
  createStore,
} from './integration-test.setup';

describe('Integration: Move Template Between Groups', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
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

  it('should move template to a different group', () => {
    store.dispatch(
      TemplatesPageActions.moveTemplateSuccess({
        templateId: 't2',
        groupId: 'g2',
        message: 'Moved',
      }),
    );

    const templates = store.select(selectTemplates);
    const moved = templates.find((t) => t.id === 't2');
    expect(moved?.groupId).toBe('g2');
  });

  it('should ungroup a template (move to null)', () => {
    store.dispatch(
      TemplatesPageActions.moveTemplateSuccess({
        templateId: 't1',
        groupId: null,
        message: 'Ungrouped',
      }),
    );

    const items = store.select(selectTemplatesAsTreeItems);
    const ungrouped = items.find((i) => i.id === 't1');
    expect(ungrouped?.groupId).toBeNull();
  });
});
