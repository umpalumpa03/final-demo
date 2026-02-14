import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesGroup,
  selectTemplatesGroupWithConfigs,
} from '../../../store/paybill.selectors';
import {
  mockTemplates,
  mockGroups,
  setupIntegrationStore,
} from './integration-test.setup';

describe('Integration: Group CRUD', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
  });

  it('should create a new group and prepend it', async () => {
    store.dispatch(
      TemplatesPageActions.createTemplatesGroupsSuccess({
        templateGroup: {
          id: 'g3',
          groupName: 'Entertainment',
          templateCount: 0,
        },
      }),
    );

    const groups = await firstValueFrom(store.select(selectTemplatesGroup));
    expect(groups).toHaveLength(3);
    expect(groups[0].groupName).toBe('Entertainment');
  });

  it('should rename a group and reflect in selectors', async () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateGroupSuccess({
        templateGroup: {
          id: 'g1',
          groupName: 'Home Utilities',
          templateCount: 2,
        },
        groupId: 'g1',
        message: 'Renamed',
      }),
    );

    const groups = await firstValueFrom(
      store.select(selectTemplatesGroupWithConfigs),
    );
    const renamed = groups.find((g) => g.id === 'g1');
    expect(renamed?.groupName).toBe('Home Utilities');
  });

  it('should delete a group and ungroup its templates', async () => {
    store.dispatch(
      TemplatesPageActions.deleteTemplateGroupSuccess({
        groupId: 'g1',
        message: 'Deleted',
      }),
    );

    const groups = await firstValueFrom(store.select(selectTemplatesGroup));
    expect(groups).toHaveLength(1);
    expect(groups.find((g) => g.id === 'g1')).toBeUndefined();

    const templates = await firstValueFrom(store.select(selectTemplates));
    const t1 = templates.find((t) => t.id === 't1');
    const t3 = templates.find((t) => t.id === 't3');
    expect(t1?.groupId).toBeNull();
    expect(t3?.groupId).toBeNull();

    const t2 = templates.find((t) => t.id === 't2');
    expect(t2?.groupId).toBeNull();
  });
});
