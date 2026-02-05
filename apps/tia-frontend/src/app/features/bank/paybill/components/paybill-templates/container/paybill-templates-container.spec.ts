import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PaybillTemplatesContainer } from './paybill-templates-container';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { provideMockStore } from '@ngrx/store/testing';
import {
  selectTemplatesGroupWithConfigs,
  selectTemplatesAsTreeItems,
} from '../../../store/paybill.selectors';
import { HeaderCtaAction, ModalType } from '../models/paybill-templates.model';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';

const mockTemplatesGroup = [
  {
    id: 1,
    name: 'Test Group',
    icon: 'images/svg/paybill/group.svg',
    expanded: true,
  },
];

const mockTemplates: any[] = [];

const mockModalConfig = {
  [ModalType.Template]: { title: 'Template Modal' },
  [ModalType.Group]: { title: 'Group Modal' },
};

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let fixture: ComponentFixture<PaybillTemplatesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectTemplatesGroupWithConfigs,
              value: mockTemplatesGroup,
            },
            { selector: selectTemplatesAsTreeItems, value: mockTemplates },
          ],
        }),
        { provide: PaybillTemplatesService, useValue: {} },
      ],
    })
      .overrideComponent(PaybillTemplatesContainer, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillTemplatesContainer);
    component = fixture.componentInstance;
    (component as any).modalConfig = mockModalConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select template groups from store', () => {
    expect(component.templateGroups()).toEqual(mockTemplatesGroup);
  });

  it('should set modalType to Template and open modal for createTemplate action', () => {
    component.handleHeaderAction('createTemplate' as HeaderCtaAction);

    expect(component.modalType()).toBe(ModalType.Template);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should set modalType to Group and open modal for createGroup action', () => {
    component.handleHeaderAction('createGroup' as HeaderCtaAction);

    expect(component.modalType()).toBe(ModalType.Group);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should toggle modal from closed to open', () => {
    expect(component.isModalOpen()).toBe(false);

    component.handleModalToggle();

    expect(component.isModalOpen()).toBe(true);
  });

  it('should toggle modal from open to closed', () => {
    component.isModalOpen.set(true);

    component.handleModalToggle();

    expect(component.isModalOpen()).toBe(false);
  });

  it('should return Template config when modalType is Template', () => {
    component.modalType.set(ModalType.Template);

    expect(component['currentModalConfig']()).toEqual(
      mockModalConfig[ModalType.Template],
    );
  });

  it('should return Group config when modalType is Group', () => {
    component.modalType.set(ModalType.Group);

    expect(component['currentModalConfig']()).toEqual(
      mockModalConfig[ModalType.Group],
    );
  });

  it('should return null when modalType is null', () => {
    component.modalType.set(null);

    expect(component['currentModalConfig']()).toBeNull();
  });

  describe('Extended Logic & Store Dispatches', () => {
    it('ngOnInit: should dispatch load actions', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.loadTemplateGroups(),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.loadTemplates(),
      );
    });

    it('onCategorySelected: should dispatch selectCategory action', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.onCategorySelected('CAT_123');

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'CAT_123' }),
      );
    });

    it('categoryOptions: should map templateCategories to select options via computed signal', () => {
      (component as any).templateCategories = () => [
        { id: '1', name: 'Utilities' },
        { id: '2', name: 'Mobile' },
      ];

      const options = component.categoryOptions();
      expect(options).toEqual([
        { label: 'Utilities', value: '1' },
        { label: 'Mobile', value: '2' },
      ]);
    });

    it('handleFormSubmit: should dispatch createTemplatesGroups when payload type is create-group', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      const payload = {
        type: 'create-group',
        values: { name: 'New House Group' },
      } as any;

      component.handleFormSubmit(payload);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.createTemplatesGroups({
          groupName: 'New House Group',
          templateIds: [],
        }),
      );
    });

    it('onItemDeleteAction: should find template name and open delete modal', () => {
      const mockTemplates = [{ id: 'T1', title: 'Electric Bill' }];
      (component as any).templates = () => mockTemplates;

      component.onItemDeleteAction('T1');

      expect(component.selectedId()).toBe('T1');
      expect(component.selectedItemName()).toBe('Electric Bill');
      expect(component.modalType()).toBe(ModalType.DeleteTemplate);
      expect(component.isModalOpen()).toBe(true);
    });

    it('deleteTemplate: should dispatch delete action and close modal', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.selectedId.set('T123');
      component.isModalOpen.set(true);

      component.deleteTemplate();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.deleteTemplate({ templateId: 'T123' }),
      );
      expect(component.isModalOpen()).toBe(false);
    });

    it('deleteTemplate: should not dispatch if selectedId is null', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');

      component.deleteTemplate();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Container Business Logic', () => {
    it('handleFormSubmit: should dispatch renameTemplate when payload type is rename-template', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.selectedId.set('T_RENAME_ID');

      const payload = {
        type: 'rename-template',
        values: { name: 'New Nickname' },
      } as any;

      component.handleFormSubmit(payload);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.renameTemplate({
          templateId: 'T_RENAME_ID',
          nickName: 'New Nickname',
        }),
      );
    });

    it('handleFormSubmit: should dispatch renameTemplateGroup when payload type is rename-group', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.selectedId.set('G_RENAME_ID');

      const payload = {
        type: 'rename-group',
        values: { name: 'Updated Group Name' },
      } as any;

      component.handleFormSubmit(payload);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.renameTemplateGroup({
          groupId: 'G_RENAME_ID',
          groupName: 'Updated Group Name',
        }),
      );
    });

    it('onGroupEditAction: should find group and set data for renaming', () => {
      const mockGroups = [{ id: 'G1', groupName: 'My Group' }];
      (component as any).templateGroups = () => mockGroups;

      component.onGroupEditAction('G1');

      expect(component.selectedId()).toBe('G1');
      expect(component.selectedItemName()).toBe('My Group');
      expect(component.modalType()).toBe(ModalType.RenameGroup);
      expect(component.isModalOpen()).toBe(true);
    });

    it('onGroupDeleteAction: should set delete group modal state', () => {
      const mockGroups = [{ id: 'G2', groupName: 'Bills' }];
      (component as any).templateGroups = () => mockGroups;

      component.onGroupDeleteAction('G2');

      expect(component.modalType()).toBe(ModalType.DeleteGroup);
    });

    it('deleteGroup: should dispatch deleteTemplateGroup action', () => {
      const dispatchSpy = vi.spyOn(component.store, 'dispatch');
      component.selectedId.set('G_DELETE_ID');
      component.isModalOpen.set(true);

      component.deleteGroup();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TemplatesPageActions.deleteTemplateGroup({ groupId: 'G_DELETE_ID' }),
      );
      expect(component.isModalOpen()).toBe(false);
    });

    it('onItemEditAction: should find template and open rename modal', () => {
      const mockTemplates = [{ id: 'T5', title: 'Gym Membership' }];
      (component as any).templates = () => mockTemplates;

      component.onItemEditAction('T5');

      expect(component.selectedId()).toBe('T5');
      expect(component.selectedItemName()).toBe('Gym Membership');
      expect(component.modalType()).toBe(ModalType.RenameTemplate);
    });
  });
});
