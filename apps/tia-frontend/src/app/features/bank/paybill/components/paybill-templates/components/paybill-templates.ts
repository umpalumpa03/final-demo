import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
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
import { JsonPipe } from '@angular/common';

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
    JsonPipe,
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

  // Build templates for form
  createGroupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
  });

  createTemplateForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    serviceProvider: ['', Validators.required],
    accountNumber: ['', Validators.required],
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
    this.modalOpenAction.emit();
  }

  public formSubmit = output<FormSubmitPayload>();

  activeForm = computed(() => {
    switch (this.activeModal()) {
      case ModalType.Group:
        return this.createGroupForm;
      case ModalType.Template:
        return this.createTemplateForm;
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
    console.log('hello');
    const value = (event.target as HTMLSelectElement).value;

    if (controlName === 'category' && value) {
      this.categorySelected.emit(value);
    }
  }

  public itemDeleteIcon = output<string>();
  public itemEditIcon = output<string>();
  public GroupDeleteIcon = output<string>();
  public GroupEditIcon = output<string>();

  public selectedDeleteItem = input();
  onItemDeleteAction(id: string) {
    this.itemDeleteIcon.emit(id);
  }

  onItemEditAction(id: string) {
    this.itemEditIcon.emit(id);
  }

  onGroupEditAction(id: string) {
    this.GroupEditIcon.emit(id);
  }

  onGroupDeleteAction(id: string) {
    this.GroupDeleteIcon.emit(id);
  }

  public deleteTemplateModal = output<string>();

  onActionHandler(action: string | undefined) {
    if (action === 'deleteTemplate') {
      this.deleteTemplateModal.emit('asd');
    }
  }
}
