import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
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
  FormSubmitPayload,
  formSubmitType,
  HeaderCtaAction,
  ModalInfo,
  ModalType,
  TemplateGroups,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaybillProvider } from '../../paybill-main/shared/models/paybill.model';

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
  ],
  templateUrl: './paybill-templates.html',
  styleUrl: './paybill-templates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplates {
  public fb = inject(FormBuilder);
  // Config for tree build
  public templateGroups = input.required<TemplateGroups[]>();
  public templates = input.required<TreeItem[]>();
  public headerButtons = HeaderCtaConfig;

  public templateCategories = input.required<
    {
      label: string;
      value: string;
    }[]
  >();
  public templateProviders = input<PaybillProvider[]>();
  public isLoading = input.required<boolean>();

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

  // Build templates for form
  createGroupForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  createTemplateForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    serviceProvider: ['', Validators.required],
    accountNumber: ['', Validators.required],
  });

  editTemplate = this.fb.nonNullable.group({
    currentName: [{ value: '', disabled: true }],
    name: ['', Validators.required],
  });

  editGroup = this.fb.nonNullable.group({
    currentName: [{ value: '', disabled: true }],
    name: ['', Validators.required],
  });

  public currentModalConfig = input<ModalInfo | null>(null);

  // Determine Which type of modal to be shown
  public activeModal = input<ModalType | null>();

  // Handle Modal Open / Close actions
  public isModalOpen = input<boolean>(false);

  // Handle Header Button Clicks
  public headerButtonAction = output<HeaderCtaAction>();
  public modalOpenAction = output<void>();

  public handleHeaderButtonClick(action: HeaderCtaAction): void {
    this.headerButtonAction.emit(action);
  }

  public toggleModal(): void {
    if (this.isModalOpen()) {
      const form = this.activeForm();
      if (form) {
        form.reset();
        form.markAsPristine();
        form.markAsUntouched();
      }
    }
    this.modalOpenAction.emit();
  }

  public formSubmit = output<FormSubmitPayload>();

  activeForm = computed(() => {
    switch (this.activeModal()) {
      case ModalType.Group:
        return this.createGroupForm;
      case ModalType.Template:
        return this.createTemplateForm;
      case ModalType.RenameTemplate:
        return this.editTemplate;
      case ModalType.RenameGroup:
        return this.editGroup;
      default:
        return null;
    }
  });

  onSubmit(type: formSubmitType): void {
    const form = this.activeForm();

    if (form?.valid) {
      this.formSubmit.emit({
        type,
        values: form.value,
      });
    }
  }

  public categorySelected = output<string>();

  onDropdownChange(controlName: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (controlName === 'category' && value) {
      this.categorySelected.emit(value);
    }
  }

  public itemDeleteIcon = output<string>();
  public itemEditIcon = output<string>();
  public groupDeleteIcon = output<string>();
  public groupEditIcon = output<string>();

  public selectedDeleteItem = input();
  onItemDeleteAction(id: string) {
    this.itemDeleteIcon.emit(id);
  }

  onItemEditAction(id: string) {
    this.itemEditIcon.emit(id);
  }

  onGroupEditAction(id: string) {
    this.groupEditIcon.emit(id);
  }

  onGroupDeleteAction(id: string) {
    this.groupDeleteIcon.emit(id);
  }

  public deleteTemplateModal = output<void>();
  public editTemplateModal = output<void>();
  public deleteGroupModal = output<void>();
  public renameGroupModal = output<void>();

  onActionHandler(action: string | undefined) {
    if (action === 'deleteTemplate') {
      this.deleteTemplateModal.emit();
    }

    if (action === 'renameTemplate') {
      this.editTemplateModal.emit();
    }

    if (action === 'deleteGroup') {
      this.deleteGroupModal.emit();
    }

    if (action === 'renameGroup') {
      this.renameGroupModal.emit();
    }
  }
}
