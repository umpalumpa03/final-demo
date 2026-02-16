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
import { initialPaybillState } from '../../../store/paybill.state';

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let store: MockStore;
  let actions$!: Observable<any>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState: { paybill: initialPaybillState } }),
        provideMockActions(() => actions$),
      ],
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
    component.createTemplateForm.get('category')?.setValue('ELECTRIC');

    component.onParentProviderSelect({ providerId: 'p-1', index: 1 });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.clearPaymentDetails(),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.selectProvider({ providerId: 'p-1', level: 1 }),
    );
  });

  it('should close modal and clear state', () => {
    component.isModalOpen.set(true);
    component.modalType.set(ModalType.DeleteTemplate);
    component.selectedId.set('t-100');
    component.selectedItemName.set('Test');

    component.handleModalToggle();

    expect(component.isModalOpen()).toBe(false);
    expect(component.modalType()).toBeNull();
    expect(component.selectedId()).toBe('');
    expect(component.selectedItemName()).toBe('');
  });

  it('should dispatch create group action', () => {
    component.handleFormSubmit({
      type: 'create-group',
      values: { name: 'New Group' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.createTemplatesGroups({
        groupName: 'New Group',
        templateIds: [],
      }),
    );
  });

  it('should dispatch rename group action', () => {
    component.selectedId.set('g-1');
    component.handleFormSubmit({
      type: 'rename-group',
      values: { name: 'Updated Group' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.renameTemplateGroup({
        groupId: 'g-1',
        groupName: 'Updated Group',
      }),
    );
  });

  it('should dispatch moveTemplate when templateMoved is called', () => {
    component.templateMoved({
      itemId: 't-1',
      fromGroupId: 'g-1',
      toGroupId: 'g-2',
      newOrder: 1,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.moveTemplate({
        groupId: 'g-2',
        templateId: 't-1',
      }),
    );
  });

  it('should handle item-edit action', () => {
    component.onTreeAction({ id: 't-100', type: 'item-edit' });
    expect(component.modalType()).toBe(ModalType.RenameTemplate);
  });

  it('should handle group-delete action', () => {
    component.onTreeAction({ id: 'g-200', type: 'group-delete' });
    expect(component.modalType()).toBe(ModalType.DeleteGroup);
  });

  it('should not dispatch if providerId is null', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.onParentProviderSelect({ providerId: null, index: 1 });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('selectProvider'),
      }),
    );
  });

  it('should return filtered templates when search has value', () => {
    component.filteredTemplates.set([{ id: '1', title: 'Filtered' }] as any);
    component.searchControl.setValue('test');
    // the component uses `hasSearch()` to decide which list to return — set it explicitly
    component.hasSearch.set(true);

    const result = component.displayTemplates();

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Filtered');
  });

  it('should return original templates when no filter', () => {
    component.filteredTemplates.set([]);
    component.searchControl.setValue('');

    const result = component.displayTemplates();

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Electric Bill');
  });

  it('should handle modal submission for RenameTemplate', () => {
    component.selectedId.set('t-100');

    component.handleFormSubmit({
      type: 'rename-template',
      values: { name: 'New Nickname' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.renameTemplate({
        templateId: 't-100',
        nickName: 'New Nickname',
      }),
    );
  });
  it('should compute categoryOptions correctly from templateCategories', () => {
    (component as any).templateCategories.set([
      { id: 'cat-1', name: 'Utilities' },
      { id: 'cat-2', name: 'Government' },
    ]);

    expect(component.categoryOptions()).toEqual([
      { label: 'Utilities', value: 'cat-1' },
      { label: 'Government', value: 'cat-2' },
    ]);
  });

  it('should dispatch checkBillForTemplate on create-template form submission', () => {
    (component as any).serviceId = signal('service-777');
    const formValues = {
      name: 'Electric Bill',
      category: 'cat-1',
      accountNumber: '12345',
    };

    component.handleFormSubmit({
      type: 'create-template',
      values: formValues,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      TemplatesPageActions.checkBillForTemplate({
        serviceId: 'service-777',
        identification: { accountNumber: '12345' },
        nickname: 'Electric Bill',
      }),
    );
  });

  it('should handle category selection and reset form state', () => {
    const payBillService = (component as any).payBill;
    const resetSpy = vi.spyOn(payBillService, 'resetFormToInitialState');

    component.onCategorySelect('UTILITY_ID');

    expect(store.dispatch).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: 'UTILITY_ID' }),
    );
    expect(component.currentLevel()).toBe(0);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should close modal automatically on success actions', () => {
    const mockSuccessProps = {
      template: { id: 't-100' } as any,
      message: 'Success',
    };

    component.isModalOpen.set(true);
    const toggleSpy = vi.spyOn(component, 'handleModalToggle');

    (actions$ as ReplaySubject<any>).next(
      TemplatesPageActions.renameTemplateSuccess(mockSuccessProps),
    );

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should handle HeaderCtaAction.Pay by setting modal type to ConfirmPayment', () => {
    component.handleHeaderAction(HeaderCtaAction.Pay);
    expect(component.modalType()).toBe(ModalType.ConfirmPayment);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should not dispatch rename-template if selectedId is empty', () => {
    component.selectedId.set('');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.handleFormSubmit({
      type: 'rename-template',
      values: { name: 'Test' },
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('renameTemplate'),
      }),
    );
  });

  it('should not dispatch rename-group if selectedId is empty', () => {
    component.selectedId.set('');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.handleFormSubmit({
      type: 'rename-group',
      values: { name: 'Test' },
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('renameTemplateGroup'),
      }),
    );
  });

  it('should not dispatch deleteTemplate if selectedId is empty', () => {
    component.selectedId.set('');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.deleteTemplate();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('deleteTemplate'),
      }),
    );
  });

  it('should not dispatch deleteGroup if selectedId is empty', () => {
    component.selectedId.set('');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    dispatchSpy.mockClear();

    component.deleteGroup();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('deleteTemplateGroup'),
      }),
    );
  });

  describe('Item Selection', () => {
    it('should dispatch addCheckedItems when onItemChecked is called', () => {
      (component as any).originalTemplates = signal([
        {
          id: 't-100',
          nickname: 'Electric Bill',
          serviceId: 's1',
          identification: { accountNumber: '123' },
          amountDue: 50,
          groupId: null,
        },
        {
          id: 't-200',
          nickname: 'Water Bill',
          serviceId: 's2',
          identification: { accountNumber: '456' },
          amountDue: 30,
          groupId: null,
        },
      ]);

      component.onItemChecked(['t-100']);

      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.addCheckedItems({
          selectedItems: [
            {
              id: 't-100',
              nickname: 'Electric Bill',
              serviceId: 's1',
              identification: { accountNumber: '123' },
              amountDue: 50,
              groupId: null,
            },
          ],
        }),
      );
    });

    it('should dispatch addCheckedItems for single item on onSelectedItem', () => {
      (component as any).originalTemplates = signal([
        {
          id: 't-100',
          nickname: 'Electric Bill',
          serviceId: 's1',
          identification: { accountNumber: '123' },
          amountDue: 50,
          groupId: null,
        },
      ]);

      component.onSelectedItem('t-100');

      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.clearPaymentInfo(),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        TemplatesPageActions.addCheckedItems({
          selectedItems: [
            {
              id: 't-100',
              nickname: 'Electric Bill',
              serviceId: 's1',
              identification: { accountNumber: '123' },
              amountDue: 50,
              groupId: null,
            },
          ],
        }),
      );
    });
  });

  describe('OTP and Payment', () => {
    it('should set OTP modal state on onOtpClose', () => {
      component.isOtpModalOpen.set(true);
      component.isPaymentModalVisible.set(true);

      component.onOtpClose(false);

      expect(component.isOtpModalOpen()).toBe(false);
      expect(component.isPaymentModalVisible()).toBe(false);
    });

    it('should return base config without initialValues for non-rename modals', () => {
      component.modalType.set(ModalType.DeleteTemplate);
      const config = component.currentModalConfig();
      expect(config).toBeTruthy();
      expect(config?.initialValues).toBeUndefined();
    });

    it('should return merged config with initialValues for RenameGroup', () => {
      component.modalType.set(ModalType.RenameGroup);
      component.selectedItemName.set('My Group');
      const config = component.currentModalConfig();
      expect(config?.initialValues).toEqual({ currentName: 'My Group' });
    });
  });
});
