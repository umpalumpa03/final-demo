import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { TemplatesPageActions } from '../../../store/paybill.actions';
import {
  selectTemplates,
  selectTemplatesAsTreeItems,
  selectSelectedTemplates,
} from '../../../store/paybill.selectors';
import { Templates } from '../models/paybill-templates.model';
import { mockTemplates, setupIntegrationStore } from './integration-test.setup';

describe('Integration: Template CRUD', () => {
  let store: Store;

  beforeEach(() => {
    store = setupIntegrationStore();
    store.dispatch(
      TemplatesPageActions.loadTemplatesSuccess({
        templates: mockTemplates,
      }),
    );
  });

  it('should rename a template and reflect in selectors', async () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateSuccess({
        template: { ...mockTemplates[0], nickname: 'Fiber Internet' },
      }),
    );

    const templates = await firstValueFrom(store.select(selectTemplates));
    const renamed = templates.find((t) => t.id === 't1');
    expect(renamed?.nickname).toBe('Fiber Internet');
  });

  it('should rename a template and reflect in tree items', async () => {
    store.dispatch(
      TemplatesPageActions.renameTemplateSuccess({
        template: { ...mockTemplates[0], nickname: 'Fiber Internet' },
      }),
    );

    const items = await firstValueFrom(
      store.select(selectTemplatesAsTreeItems),
    );
    const renamed = items.find((t) => t.id === 't1');
    expect(renamed?.title).toBe('Fiber Internet');
  });

  it('should delete a template and remove it from selectors', async () => {
    store.dispatch(
      TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't2',
        message: 'Deleted',
      }),
    );

    const templates = await firstValueFrom(store.select(selectTemplates));
    expect(templates).toHaveLength(2);
    expect(templates.find((t) => t.id === 't2')).toBeUndefined();
  });

  it('should also remove deleted template from selectedItems', async () => {
    store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: [mockTemplates[0], mockTemplates[1]],
      }),
    );

    store.dispatch(
      TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't1',
        message: 'Deleted',
      }),
    );

    const selected = await firstValueFrom(
      store.select(selectSelectedTemplates),
    );
    expect(selected).toHaveLength(1);
    expect(selected[0].id).toBe('t2');
  });

  it('should add a new template via createTemplateSuccess', async () => {
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

    const templates = await firstValueFrom(store.select(selectTemplates));
    expect(templates).toHaveLength(4);
    expect(templates[3].nickname).toBe('Gas Bill');
  });
});
