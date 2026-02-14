import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplatesAsTreeItems,
  selectTemplatesGroupWithConfigs,
} from '../../../store/paybill.selectors';
import {
  mockTemplates,
  mockGroups,
  setupIntegrationStore,
} from './integration-test.setup';

describe('Integration: Derived Selectors', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
  });

  describe('selectTemplatesAsTreeItems', () => {
    it('should map templates to tree items with correct shape', async () => {
      store.dispatch(
        TemplatesPageActions.loadTemplatesSuccess({
          templates: mockTemplates,
        }),
      );

      const items = await firstValueFrom(
        store.select(selectTemplatesAsTreeItems),
      );
      expect(items).toHaveLength(3);

      const first = items[0];
      expect(first.id).toBe('t1');
      expect(first.title).toBe('Internet Bill');
      expect(first.subtitle).toBe('svc-internet');
      expect(first.groupId).toBe('g1');
      expect(first.icon).toBe('images/svg/paybill/favorite.svg');
      expect(first.accountNumber).toBe('111');
      expect(first.order).toBe(0);
    });

    it('should return empty array when no templates are loaded', async () => {
      const items = await firstValueFrom(
        store.select(selectTemplatesAsTreeItems),
      );
      expect(items).toEqual([]);
    });
  });

  describe('selectTemplatesGroupWithConfigs', () => {
    it('should add icon and expanded flag to groups', async () => {
      store.dispatch(
        TemplatesPageActions.loadTemplateGroupsSuccess({
          templateGroups: mockGroups,
        }),
      );

      const groups = await firstValueFrom(
        store.select(selectTemplatesGroupWithConfigs),
      );
      expect(groups).toHaveLength(2);

      expect(groups[0].icon).toBe('images/svg/paybill/group.svg');
      expect(groups[0].expanded).toBe(true);
      expect(groups[1].expanded).toBe(false);
    });
  });
});
