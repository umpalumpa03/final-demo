import { describe, it, expect, beforeEach } from 'vitest';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesAsTreeItems,
  selectSelectedTemplates,
} from '../../../store/paybill.selectors';
import { Templates } from '../models/paybill-templates.model';
import { mockTemplates, createStore } from './integration-test.setup';

describe('Integration: Template CRUD', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
  });

  it('should rename a template and reflect in selectors', () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateSuccess({
        template: { ...mockTemplates[0], nickname: 'Fiber Internet' },
      }),
    );

    const templates = store.select(selectTemplates);
    const renamed = templates.find((t) => t.id === 't1');
    expect(renamed?.nickname).toBe('Fiber Internet');
  });

  it('should rename a template and reflect in tree items', () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateSuccess({
        template: { ...mockTemplates[0], nickname: 'Fiber Internet' },
      }),
    );

    const items = store.select(selectTemplatesAsTreeItems);
    const renamed = items.find((t) => t.id === 't1');
    expect(renamed?.title).toBe('Fiber Internet');
  });

  it('should delete a template and remove it from selectors', () => {
    store.dispatch(
      TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't2',
        message: 'Deleted',
      }),
    );

    const templates = store.select(selectTemplates);
    expect(templates).toHaveLength(2);
    expect(templates.find((t) => t.id === 't2')).toBeUndefined();
  });

  it('should add a new template via createTemplateSuccess', () => {
    const newTemplate: Templates = {
      id: 't4',
      nickname: 'Gas Bill',
      serviceId: 'svc-gas',
      identification: { accountNumber: '444' },
      amountDue: 40,
      groupId: null,
    };

    store.dispatch(
      TemplatesPageActions.createTemplateSuccess({
        payload: newTemplate,
        message: 'Created',
      }),
    );

    const templates = store.select(selectTemplates);
    expect(templates).toHaveLength(4);
    expect(templates[3].nickname).toBe('Gas Bill');
  });
});
