import { TestBed } from '@angular/core/testing';
import { PaybillTemplatesContainer } from './paybill-templates-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import { HeaderCtaAction, ModalType } from '../models/paybill-templates.model';
import { signal } from '@angular/core';

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    component = TestBed.createComponent(
      PaybillTemplatesContainer,
    ).componentInstance;

    (component as any).templates = signal([
      { id: 't-100', title: 'Electric Bill' },
    ]);
    (component as any).templateGroups = signal([
      { id: 'g-200', groupName: 'Utilities' },
    ]);
    (component as any).templateCategories = signal([]);
    (component as any).isLoading = signal(false);
    (component as any).templateCategories = signal([]);

    vi.spyOn(store, 'dispatch');
  });

  it('should toggle selectAll', () => {
    component.handleHeaderAction(HeaderCtaAction.SelectAll);
    expect(component.selectAll()).toBe(true);
  });

  it('should open creation modals', () => {
    component.handleHeaderAction(HeaderCtaAction.CreateTemplate);
    expect(component.modalType()).toBe(ModalType.Template);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should select template and open delete modal', () => {
    component.onTreeAction({ id: 't-100', type: 'item-delete' });
    expect(component.selectedItemName()).toBe('Electric Bill');
    expect(component.modalType()).toBe(ModalType.DeleteTemplate);
  });

  it('should select group and open edit modal', () => {
    component.onTreeAction({ id: 'g-200', type: 'group-edit' });
    expect(component.selectedItemName()).toBe('Utilities');
    expect(component.modalType()).toBe(ModalType.RenameGroup);
  });

  it('should dispatch create-group and close modal', () => {
    component.isModalOpen.set(true);
    component.handleFormSubmit({
      type: 'create-group',
      values: { name: 'New' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.createTemplatesGroups({
        groupName: 'New',
        templateIds: [],
      }),
    );
    expect(component.isModalOpen()).toBe(false);
    expect(component.selectedId()).toBe('');
  });

  it('should dispatch rename-template when ID is present', () => {
    component.selectedId.set('t-100');
    component.handleFormSubmit({
      type: 'rename-template',
      values: { name: 'New Name' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.renameTemplate({
        templateId: 't-100',
        nickName: 'New Name',
      }),
    );
  });

  it('should dispatch delete and movements', () => {
    component.selectedId.set('t-100');
    component.deleteTemplate();
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.deleteTemplate({ templateId: 't-100' }),
    );

    component.templateMoved({
      itemId: 't1',
      toGroupId: 'g1',
      fromGroupId: 'g0',
      newOrder: 0,
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.moveTemplate({ templateId: 't1', groupId: 'g1' }),
    );

    component.onCategorySelected('cat1');
    expect(store.dispatch).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: 'cat1' }),
    );
  });

  it('should return null or merged config', () => {
    component.modalType.set(null);
    expect(component.currentModalConfig()).toBeNull();

    component.modalType.set(ModalType.RenameTemplate);
    component.selectedItemName.set('Test');
    expect(component.currentModalConfig()?.initialValues).toEqual({
      currentName: 'Test',
    });
  });
});
