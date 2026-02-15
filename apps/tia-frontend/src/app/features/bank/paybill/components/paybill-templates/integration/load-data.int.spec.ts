import { describe, it, expect, beforeEach } from 'vitest';

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
  createStore,
} from './integration-test.setup';

describe('Integration: Load Templates & Groups', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('should set loading true on loadTemplates', () => {
    store.dispatch(TemplatesPageActions.loadTemplates());

    expect(store.select(selectLoading)).toBe(true);
  });

  it('should populate templates via selectTemplates', () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );

    const templates = store.select(selectTemplates);
    expect(templates).toHaveLength(3);
    expect(templates[0].nickname).toBe('Internet Bill');
  });

  it('should mark templates as loaded after success', () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );

    expect(store.select(selectTemplatesLoaded)).toBe(true);
  });

  it('should populate groups via selectTemplatesGroup', () => {
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );

    const groups = store.select(selectTemplatesGroup);
    expect(groups).toHaveLength(2);
    expect(groups[0].groupName).toBe('Utilities');
  });

  it('should mark groups as loaded after success', () => {
    store.dispatch(
      TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups: mockGroups,
      }),
    );

    expect(store.select(selectTemplateGroupsLoaded)).toBe(true);
  });

  it('should set error on loadTemplatesFailure', () => {
    store.dispatch(
      TemplatesPageActions.loadTemplatesFailure({
        error: 'Network error',
      }),
    );

    expect(store.select(selectError)).toBe('Network error');
  });
});
