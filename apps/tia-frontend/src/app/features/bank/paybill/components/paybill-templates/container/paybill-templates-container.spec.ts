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
import { Observable, ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let store: MockStore;
  let actions$!: Observable<any>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer, TranslateModule.forRoot()],
      providers: [provideMockStore(), provideMockActions(() => actions$)],
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

  describe('Lifecycle Hooks', () => {
    it('should dispatch initialization actions on ngOnInit', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearSelection(),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.loadTemplateGroups(),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.loadTemplates(),
      );
    });
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

  it('should dispatch selectCategory and reset currentLevel when a category is provided', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.currentLevel.set(5);

    component.onCategorySelect('UTIL');

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: 'UTIL' }),
    );
    expect(component.currentLevel()).toBe(0);
  });

  it('should return early and do nothing if category is null (Guard Branch)', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onCategorySelect(null as any);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch selectProvider with correct payload when valid info is provided', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const providerInfo = { providerId: 'p-101', index: 1 };

    component.onParentProviderSelect(providerInfo);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TemplatesPageActions.selectProvider({
        providerId: 'p-101',
        level: 1,
      }),
    );
  });

  it('should dispatch deleteTemplate when deleteTemplate is called', () => {
    component.selectedId.set('t-100');
    component.deleteTemplate();
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.deleteTemplate({ templateId: 't-100' }),
    );
  });

  it('should dispatch deleteTemplateGroup when deleteGroup is called', () => {
    component.selectedId.set('g-200');
    component.deleteGroup();
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.deleteTemplateGroup({ groupId: 'g-200' }),
    );
  });

  it('should handle CreateGroup header action', () => {
    component.handleHeaderAction(HeaderCtaAction.CreateGroup);
    expect(component.modalType()).toBe(ModalType.Group);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should clear payment details and reset form if level is lower than current', () => {
    component.currentLevel.set(2);
    // Mock the form control
    component.createTemplateForm.get('category')?.setValue('ELECTRIC');

    component.onParentProviderSelect({ providerId: 'p-1', index: 1 });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.clearPaymentDetails(),
    );
    // Checking if selectProvider was still called
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.selectProvider({ providerId: 'p-1', level: 1 }),
    );
  });
});
