import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { Store } from '@ngrx/store';
import {
  selectCategories,
  selectFilteredProviders,
  selectFormPayload,
  selectLoading,
  selectPaymentFields,
  selectProviders,
  selectProvidersDropdown,
  selectSelectedCategoryId,
  selectSelectedTemplates,
  selectServiceId,
  selectTemplates,
  selectTemplatesAsTreeItems,
  selectTemplatesGroupWithConfigs,
  selectVerifiedDetails,
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
  TemplateGroups,
  TreeAction,
  TreeItemMoved,
} from '../models/paybill-templates.model';
import { ModalConfig } from '../configs/cta-buttons.config';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  createEditGroupForm,
  createEditTemplateForm,
  createGroupForm,
  createTemplateForm,
} from '../configs/paybill-templates.forms';
import { PaybillDynamicForm } from '../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { paybillSearchConfig } from '../configs/search.config';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';

@Component({
  selector: 'app-paybill-templates-container',
  imports: [PaybillTemplates, TextInput, ReactiveFormsModule],
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
  private readonly payBill = inject(PaybillDynamicForm);
  private readonly actions$ = inject(Actions);
  private paybillTemplateService = inject(PaybillTemplatesService);

  private readonly successListener = this.actions$
    .pipe(
      ofType(
        TemplatesPageActions.createTemplateSuccess,
        TemplatesPageActions.createTemplatesGroupsSuccess,
        TemplatesPageActions.renameTemplateSuccess,
        TemplatesPageActions.renameTemplateGroupSuccess,
        TemplatesPageActions.deleteTemplateSuccess,
        TemplatesPageActions.deleteTemplateGroupSuccess,
      ),
      takeUntilDestroyed(),
    )
    .subscribe(() => {
      if (this.isModalOpen()) {
        this.handleModalToggle();
      }
    });

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
    'create-template': (values) => {
      const serviceId = this.serviceId()!;
      const { name, category, ...identification } = values;

      this.store.dispatch(
        TemplatesPageActions.checkBillForTemplate({
          serviceId,
          identification,
          nickname: name,
        }),
      );
    },
    'confirm-payment': (values) => {},
  };

  public readonly searchControl = new FormControl('');
  private readonly destroyRef = inject(DestroyRef);
  public readonly searchInputConfig = paybillSearchConfig;

  // This is needed to set filtered item and then below logic apply to show the output
  public readonly filteredTemplates = signal<TreeItem[]>([]);
  public readonly filteredGroups = signal<TemplateGroups[]>([]);

  // Computed values that return filtered or original data
  public readonly displayTemplates = computed(() => {
    const filtered = this.filteredTemplates();
    return filtered.length > 0 || this.searchControl.value
      ? filtered
      : this.templates();
  });

  public readonly displayGroups = computed(() => {
    const filtered = this.filteredGroups();
    return filtered.length > 0 || this.searchControl.value
      ? filtered
      : this.templateGroups();
  });

  // On Init Load Data
  ngOnInit(): void {
    this.store.dispatch(PaybillActions.clearSelection());
    this.store.dispatch(TemplatesPageActions.loadTemplateGroups());
    this.store.dispatch(TemplatesPageActions.loadTemplates());

    // This Logic is for search filter (NO SUPPORT FROM BACKEND NEED TO HANDLE IN FRONT)
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        switchMap((searchValue) =>
          combineLatest([
            this.store.select(selectTemplatesAsTreeItems),
            this.store.select(selectTemplatesGroupWithConfigs),
          ]).pipe(
            map(([templates, groups]) =>
              this.paybillTemplateService.filterTemplatesAndGroups(
                searchValue ?? '',
                templates,
                groups,
              ),
            ),
          ),
        ),
        tap((filtered) => {
          this.filteredTemplates.set(filtered.templates);
          this.filteredGroups.set(filtered.groups);
        }),
      )
      .subscribe();
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
      case HeaderCtaAction.Pay:
        this.modalType.set(ModalType.ConfirmPayment);
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

      this.store.dispatch(TemplatesPageActions.clearPaymentInfo());
    }
    // To clear store after closing modal
    this.store.dispatch(PaybillActions.clearSelection());
  }

  public handleFormSubmit(payload: FormSubmitPayload): void {
    this.formSubmitHandlers[payload.type]?.(payload.values);
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
  }

  // Create Template Logic
  // Checks for loading state
  public selectLoading = this.store.selectSignal(selectLoading);

  // Here I get options to loop through and create visual in dumb component
  public readonly parentProviderOptions = this.store.selectSignal(
    selectProvidersDropdown,
  );

  public readonly childProviderOptions = computed(() =>
    this.store.selectSignal(selectFilteredProviders)(),
  );

  // Setting Current Level to track what is the level of child
  public readonly currentLevel = signal<number>(0);

  // Check If the main category was selected
  public readonly isCategorySelected = computed(
    () => this.store.selectSignal(selectSelectedCategoryId)() !== null,
  );

  // This is the last thing in the dropdown logic that I save to post it on back
  public readonly serviceId = this.store.selectSignal(selectServiceId);

  // Form Sync effect to create dynamic fields
  private readonly formSyncEffect = effect(() => {
    this.payBill.syncFormWithPaymentFields(this.createTemplateForm, {
      name: '',
      category: '',
    });
  });

  // Event Handlers for dynamic form
  public onCategorySelect(category: InputFieldValue): void {
    if (!category) return;

    this.store.dispatch(PaybillActions.clearSelection());

    const currentName = this.createTemplateForm.get('name')?.value;

    this.payBill.resetFormToInitialState(this.createTemplateForm, {
      name: currentName || '',
      category: category as string,
    });

    this.store.dispatch(
      PaybillActions.selectCategory({ categoryId: category as string }),
    );
    this.currentLevel.set(0);
  }

  public onParentProviderSelect(info: ProviderTypeForStore): void {
    if (!info.providerId) return;

    this.store.dispatch(TemplatesPageActions.clearPaymentDetails());

    if (info.index < this.currentLevel()) {
      this.store.dispatch(TemplatesPageActions.clearPaymentDetails());

      const currentCategory =
        this.createTemplateForm.get('category')?.value || '';
      this.payBill.resetFormToInitialState(this.createTemplateForm, {
        name: '',
        category: currentCategory,
      });
    }

    this.store.dispatch(
      TemplatesPageActions.selectProvider({
        providerId: info.providerId as string,
        level: info.index,
      }),
    );
  }

  // Create dynamic form fields
  public readonly paymentField = computed(() =>
    this.store.selectSignal(selectPaymentFields)(),
  );

  public readonly verifiedDetails = this.store.selectSignal(
    selectVerifiedDetails,
  );

  // Implement Payment Logic
  public selectedItems = this.store.selectSignal(selectSelectedTemplates);
  public originalTemplates = this.store.selectSignal(selectTemplates);

  public onItemChecked(selectedIds: string[]) {
    const selectedTemplates = [];

    for (const id of selectedIds) {
      const template = this.originalTemplates().find((t) => t.id === id);

      if (template) {
        selectedTemplates.push(template);
      }
    }

    this.store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: selectedTemplates,
      }),
    );
  }
  public onSelectedItem(selectedItemId: string) {
    this.store.dispatch(TemplatesPageActions.clearPaymentInfo());
    const selectedTemplates = [];
    const template = this.originalTemplates().find(
      (t) => t.id === selectedItemId,
    );

    if (template) {
      selectedTemplates.push(template);
    }
    this.store.dispatch(
      TemplatesPageActions.addCheckedItems({
        selectedItems: selectedTemplates,
      }),
    );
  }
  public isOtpModalOpen = signal(false);
  public isPaymentModalHidden = signal(false);

  public onPayAction() {
    this.isPaymentModalHidden.set(true);
    this.isOtpModalOpen.set(true);

    // this.store.dispatch(
    //   TemplatesPageActions.payManyBills({
    //     payments: this.billsList.buildPayload(),
    //   }),
    // );
  }
}
