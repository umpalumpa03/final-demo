import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
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
  ModalInfo,
  ModalType,
  TemplateGroups,
  TreeAction,
  TreeItemMoved,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaybillProvider } from '../../paybill-main/shared/models/paybill.model';
import {
  createEditGroupForm,
  createEditTemplateForm,
  createGroupForm,
  createTemplateForm,
} from '../configs/paybill-templates.forms';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';

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
  private readonly fb = inject(FormBuilder);
  protected readonly createGroupForm = createGroupForm(this.fb);
  protected readonly createTemplateForm = createTemplateForm(this.fb);
  protected readonly editTemplateForm = createEditTemplateForm(this.fb);
  protected readonly editGroupForm = createEditGroupForm(this.fb);

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
        return this.createGroupForm;
      case ModalType.Template:
        return this.createTemplateForm;
      case ModalType.RenameTemplate:
        return this.editTemplateForm;
      case ModalType.RenameGroup:
        return this.editGroupForm;
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
  public templateCategories = input.required<
    {
      label: string;
      value: string;
    }[]
  >();
  public serviceProvider = input.required<
    {
      label: string;
      value: string;
    }[]
  >();

  // public templateProviders = input<PaybillProvider[]>();

  public categorySelected = output<InputFieldValue>();
  public selectLoading = input<boolean>(false);

  onCategorySelect(category: InputFieldValue): void {
    this.categorySelected.emit(category);
  }
}
