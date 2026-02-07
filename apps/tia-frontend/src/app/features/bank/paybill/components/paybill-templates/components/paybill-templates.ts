import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { HeaderCtaConfig } from '../configs/cta-buttons.config';
import {
  CrudActionType,
  FormSubmitPayload,
  formSubmitType,
  HeaderCtaAction,
  HeaderCtaButton,
  MappedProviderForDropdown,
  ModalInfo,
  ModalType,
  ProviderTypeForStore,
  TemplateGroups,
  TreeAction,
  TreeItemMoved,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { distinctUntilChanged } from 'rxjs';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';

@Component({
  selector: 'app-paybill-templates',
  imports: [
    TreeContainer,
    TranslatePipe,
    ButtonComponent,
    UiModal,
    TextInput,
    LibraryTitle,
    Dropdowns,
    ReactiveFormsModule,
    Spinner,
  ],
  templateUrl: './paybill-templates.html',
  styleUrl: './paybill-templates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplates {
  // Forms
  public createGroupForm = input.required<FormGroup>();
  public createTemplateForm = input.required<FormGroup>();
  public editTemplateForm = input.required<FormGroup>();
  public editGroupForm = input.required<FormGroup>();

  // Config for tree build
  public templateGroups = input.required<TemplateGroups[]>();
  public templates = input.required<TreeItem[]>();
  public headerButtons: HeaderCtaButton[] = HeaderCtaConfig;
  public isLoading = input.required<boolean>();
  public selectAll = input<boolean>(false);

  // Modal's input outputs
  public currentModalConfig = input<ModalInfo | null>(null);
  public activeModal = input<ModalType | null>();
  public isModalOpen = input<boolean>(false);
  public selectedDeleteItem = input<string | null>(null);
  public headerButtonAction = output<HeaderCtaAction>();
  public modalOpenAction = output<void>();

  // CRUD Handlers Map
  private readonly actionHandlers: Record<CrudActionType, () => void> = {
    [CrudActionType.DeleteTemplate]: () => this.deleteTemplateModal.emit(),
    [CrudActionType.RenameTemplate]: () => this.editTemplateModal.emit(),
    [CrudActionType.DeleteGroup]: () => this.deleteGroupModal.emit(),
    [CrudActionType.RenameGroup]: () => this.renameGroupModal.emit(),
  };

  // Final Actions for CRUD Modals
  public deleteTemplateModal = output<void>();
  public editTemplateModal = output<void>();
  public deleteGroupModal = output<void>();
  public renameGroupModal = output<void>();
  public formSubmit = output<FormSubmitPayload>();

  // Modal Opener Action
  public treeAction = output<TreeAction>();

  // Tree Item Move Logic
  public treeItemMoved = output<TreeItemMoved>();

  public itemMoved(event: TreeItemMoved) {
    this.treeItemMoved.emit(event);
  }

  // Create Form Effect to reset form on modal open/close
  constructor() {
    effect(() => {
      const config = this.currentModalConfig();
      const form = this.activeForm();

      if (form) {
        form.reset();
        form.markAsPristine();
        form.markAsUntouched();

        if (config?.initialValues) {
          form.patchValue(config.initialValues);
        }
      }
    });
  }

  // Action Handlers
  public handleHeaderButtonClick(action: HeaderCtaAction): void {
    this.headerButtonAction.emit(action);
  }

  public onActionHandler(action: CrudActionType | undefined): void {
    if (action) {
      this.actionHandlers[action]?.();
    }
  }

  // Handle Active Form based on Modal Type
  public activeForm = computed(() => {
    switch (this.activeModal()) {
      case ModalType.Group:
        return this.createGroupForm();
      case ModalType.Template:
        return this.createTemplateForm();
      case ModalType.RenameTemplate:
        return this.editTemplateForm();
      case ModalType.RenameGroup:
        return this.editGroupForm();
      default:
        return null;
    }
  });

  // Handles for Tree Actions
  onItemDeleteAction(id: string) {
    this.treeAction.emit({ type: 'item-delete', id });
  }

  onItemEditAction(id: string) {
    this.treeAction.emit({ type: 'item-edit', id });
  }

  onGroupEditAction(id: string) {
    this.treeAction.emit({ type: 'group-edit', id });
  }

  onGroupDeleteAction(id: string) {
    this.treeAction.emit({ type: 'group-delete', id });
  }

  // Form Submit Handler
  public onFormSubmit(type: formSubmitType): void {
    const form = this.activeForm();

    if (form?.valid) {
      this.formSubmit.emit({
        type,
        values: form.value,
      });
    }
  }
  // // /////////////////////////////////////////////
  // //  RIGHT NOW UNUSED LOGIC KEPT FOR REFERENCE //
  // // /////////////////////////////////////////////
  public parentProviders = input.required<MappedProviderForDropdown[]>();

  public templateCategories = input.required<MappedProviderForDropdown[]>();

  public categorySelected = output<string>();
  public parentProviderSelected = output<string>();

  public selectLoading = input<boolean>(false);

  ngOnInit() {
    const form = this.createTemplateForm();
    form
      .get('category')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.categorySelected.emit(value);
      });
  }

  getDropdownOptions(controlName: string) {
    switch (controlName) {
      case 'category':
        return this.templateCategories();
      case 'parentProvider':
        return this.parentProviders();
      default:
        return [];
    }
  }

  public isCategorySelected = input<boolean>(false);
  public childProviderOptions = input<MappedProviderForDropdown[][]>([[]]);

  public childProviderSelected = output<ProviderTypeForStore>();
  public onChildProviderChange(providerId: InputFieldValue, index: number) {
    this.childProviderSelected.emit({ providerId, index });
  }
}
