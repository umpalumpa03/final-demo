import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { Store } from '@ngrx/store';
import {
  selectCategories,
  selectFilteredProviders,
  selectLoading,
  selectProviders,
  selectProvidersDropdown,
  selectSelectedCategoryId,
  selectTemplatesAsTreeItems,
  selectTemplatesGroupWithConfigs,
} from '../../../store/paybill.selectors';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import {
  FormSubmitPayload,
  formSubmitType,
  HeaderCtaAction,
  ModalType,
  ProviderTypeForStore,
  TreeAction,
  TreeItemMoved,
} from '../models/paybill-templates.model';
import { ModalConfig } from '../configs/cta-buttons.config';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { FormBuilder } from '@angular/forms';
import {
  createEditGroupForm,
  createEditTemplateForm,
  createGroupForm,
  createTemplateForm,
} from '../configs/paybill-templates.forms';

@Component({
  selector: 'app-paybill-templates-container',
  imports: [PaybillTemplates],
  templateUrl: './paybill-templates-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplatesContainer implements OnInit {
  private readonly fb = inject(FormBuilder);
  public createTemplateForm = createTemplateForm(this.fb);
  public editTemplateForm = createEditTemplateForm(this.fb);
  public editGroupForm = createEditGroupForm(this.fb);
  public createGroupForm = createGroupForm(this.fb);

  // //////////////////
  private readonly store = inject(Store);

  // Store Selections
  public readonly templateGroups = this.store.selectSignal(
    selectTemplatesGroupWithConfigs,
  );
  public readonly templates = this.store.selectSignal(
    selectTemplatesAsTreeItems,
  );
  public readonly isLoading = this.store.selectSignal(selectLoading);
  private readonly templateCategories =
    this.store.selectSignal(selectCategories);
  public readonly templateProviders = this.store.selectSignal(selectProviders);

  // Visual Handlers
  public readonly selectAll = signal<boolean>(false);
  public readonly isModalOpen = signal<boolean>(false);
  public readonly modalType = signal<ModalType | null>(null);
  public readonly selectedId = signal<string>('');
  public readonly selectedItemName = signal<string>('');

  // Modal config
  protected readonly modalConfig = ModalConfig;

  // Computed values based on some logic
  public readonly categoryOptions = computed(() =>
    this.templateCategories().map((category) => ({
      label: category.name,
      value: category.id,
    })),
  );

  public readonly currentModalConfig = computed(() => {
    const modal = this.modalType();
    if (!modal) return null;

    const baseConfig = this.modalConfig[modal];

    if (modal === ModalType.RenameGroup || modal === ModalType.RenameTemplate) {
      return {
        ...baseConfig,
        initialValues: { currentName: this.selectedItemName() },
      };
    }
    return baseConfig;
  });

  // Action Map
  private readonly formSubmitHandlers: Record<
    formSubmitType,
    (values: Record<string, string>) => void
  > = {
    'create-group': (values) => {
      this.store.dispatch(
        TemplatesPageActions.createTemplatesGroups({
          groupName: values['name'],
          templateIds: [],
        }),
      );
    },
    'rename-template': (values) => {
      const templateId = this.selectedId();
      if (templateId) {
        this.store.dispatch(
          TemplatesPageActions.renameTemplate({
            templateId,
            nickName: values['name'],
          }),
        );
      }
    },
    'rename-group': (values) => {
      const groupId = this.selectedId();
      if (groupId) {
        this.store.dispatch(
          TemplatesPageActions.renameTemplateGroup({
            groupId,
            groupName: values['name'],
          }),
        );
      }
    },
    'create-template': (values) => {},
  };

  // On Init Load Data
  ngOnInit(): void {
    this.store.dispatch(TemplatesPageActions.loadTemplateGroups());
    this.store.dispatch(TemplatesPageActions.loadTemplates());
  }

  // Handles to determine what is modals type based on clicks in header
  public handleHeaderAction(action: HeaderCtaAction): void {
    switch (action) {
      case HeaderCtaAction.SelectAll:
        this.selectAll.update((val) => !val);
        break;
      case HeaderCtaAction.CreateTemplate:
        this.modalType.set(ModalType.Template);
        this.handleModalToggle();
        break;
      case HeaderCtaAction.CreateGroup:
        this.modalType.set(ModalType.Group);
        this.handleModalToggle();
        break;
    }
  }

  // Handle Modal Open / Close Action
  public handleModalToggle(): void {
    const willClose = this.isModalOpen();
    this.isModalOpen.update((val) => !val);

    if (willClose) {
      this.modalType.set(null);
      this.selectedId.set('');
      this.selectedItemName.set('');
    }
  }

  public handleFormSubmit(payload: FormSubmitPayload): void {
    this.formSubmitHandlers[payload.type]?.(payload.values);
    this.handleModalToggle();
  }

  public onTreeAction(event: TreeAction): void {
    const actionMap: Record<TreeAction['type'], () => void> = {
      'item-delete': () =>
        this.openModal(event.id, ModalType.DeleteTemplate, 'template'),
      'item-edit': () =>
        this.openModal(event.id, ModalType.RenameTemplate, 'template'),
      'group-delete': () =>
        this.openModal(event.id, ModalType.DeleteGroup, 'group'),
      'group-edit': () =>
        this.openModal(event.id, ModalType.RenameGroup, 'group'),
    };

    actionMap[event.type]?.();
  }
  // This will open the modal
  private openModal(
    id: string,
    modalType: ModalType,
    entityType: 'template' | 'group',
  ): void {
    if (entityType === 'template') {
      this.selectTemplate(id);
    } else {
      this.selectGroup(id);
    }
    this.modalType.set(modalType);
    this.handleModalToggle();
  }

  // CRUD Actions logic
  public deleteTemplate(): void {
    this.withSelectedId((id) =>
      this.store.dispatch(
        TemplatesPageActions.deleteTemplate({ templateId: id }),
      ),
    );
  }

  public deleteGroup(): void {
    this.withSelectedId((id) =>
      this.store.dispatch(
        TemplatesPageActions.deleteTemplateGroup({ groupId: id }),
      ),
    );
  }

  public templateMoved(event: TreeItemMoved): void {
    this.store.dispatch(
      TemplatesPageActions.moveTemplate({
        groupId: event.toGroupId,
        templateId: event.itemId,
      }),
    );
  }

  private selectTemplate(id: string): void {
    const template = this.templates().find((t) => t.id === id);

    this.selectedId.set(id);
    this.selectedItemName.set(template?.title ?? '');
  }

  private selectGroup(id: string): void {
    const group = this.templateGroups().find((t) => t.id === id);

    this.selectedId.set(id);
    this.selectedItemName.set(group?.groupName ?? '');
  }

  private withSelectedId(action: (id: string) => void): void {
    const id = this.selectedId();
    if (!id) return;

    action(id);
    this.handleModalToggle();
  }

  // ///////////////////////////////////////////////////////////////

  public parentProviderOptions = this.store.selectSignal(
    selectProvidersDropdown,
  );
  public childProviderOptions = computed(() =>
    this.store.selectSignal(selectFilteredProviders)(),
  );

  public currentLevel = signal<number>(0);
  public isCategorySelected = computed(
    () => this.store.selectSignal(selectSelectedCategoryId)() !== null,
  );
  public selectLoading = this.store.selectSignal(selectLoading);

  onCategorySelect(category: InputFieldValue): void {
    if (category === '') {
      return;
    }

    this.store.dispatch(
      PaybillActions.selectCategory({ categoryId: category as string }),
    );

    this.currentLevel.set(0);
  }

  onParentProviderSelect(info: ProviderTypeForStore): void {
    if (!info.providerId) return;

    const currentLevel = info.index;

    this.store.dispatch(
      TemplatesPageActions.selectProvider({
        providerId: info.providerId as string,
        level: currentLevel,
      }),
    );
  }
}
