import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
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
  MappedProviderForDropdown,
  ModalInfo,
  ModalType,
  ProviderTypeForStore,
  TemplateGroups,
  Templates,
  TreeAction,
  TreeItemMoved,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, tap } from 'rxjs';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { DynamicInputs } from '../../shared/dynamic-inputs/dynamic-inputs';
import { PaybillDynamicField } from '../../../services/paybill-dynamic-form/models/dynamic-form.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectedItems } from '../shared/ui/selected-items/selected-items';
import { PaymentDistribution } from '../shared/ui/payment-distribution/payment-distribution';
import { BillsList } from '../shared/ui/bills-list/bills-list';
import { TotalAmount } from '../shared/ui/total-amount/total-amount';
import { AccountSelect } from '../../shared/account-select/account-select';
import { OtpVerification } from '@tia/core/auth/shared/otp-verification/otp-verification';
import { SuccessModal } from '@tia/shared/lib/overlay/ui-success-modal/ui-success-modal';

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
    DynamicInputs,
    SelectedItems,
    PaymentDistribution,
    BillsList,
    TotalAmount,
    AccountSelect,
    OtpVerification,
    SuccessModal,
  ],
  templateUrl: './paybill-templates.html',
  styleUrl: './paybill-templates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplates implements OnInit {
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
    [CrudActionType.ConfirmPayment]: () => this.payAction.emit(),
  };

  // Final Actions for CRUD Modals
  public deleteTemplateModal = output<void>();
  public editTemplateModal = output<void>();
  public deleteGroupModal = output<void>();
  public renameGroupModal = output<void>();
  public payAction = output<void>();
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

  // Outputs to change state in store
  public categorySelected = output<string>();
  public parentProviderSelected = output<string>();

  // Add loading state in form
  public selectLoading = input<boolean>(false);

  // Field that adds dynamically after everything is chosen
  public paymentFields = input.required<PaybillDynamicField[]>();

  //
  public isCategorySelected = input<boolean>(false);
  public childProviderOptions = input<MappedProviderForDropdown[][]>([[]]);

  private readonly destroyRef = inject(DestroyRef);

  // Here I listen for form category change to emit the value and start the cycle
  ngOnInit() {
    const form = this.createTemplateForm();
    form
      .get('category')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        tap((value) => this.categorySelected.emit(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Helper method to give me what kind of data is returned to me
  public getDropdownOptions(controlName: string): MappedProviderForDropdown[] {
    switch (controlName) {
      case 'category':
        return this.templateCategories();
      case 'parentProvider':
        return this.parentProviders();
      default:
        return [];
    }
  }

  public childProviderSelected = output<ProviderTypeForStore>();
  public onChildProviderChange(providerId: InputFieldValue, index: number) {
    this.childProviderSelected.emit({ providerId, index });
  }

  // Implement payment logic
  public selectedItems = input<Templates[]>();
  public markedCheckbox = output<string[]>();
  public selectedItem = output<string>();
  public onTemplateChecked(event: string[]) {
    this.markedCheckbox.emit(event);
  }

  public singleItemSelected(id: string) {
    this.selectedItem.emit(id);
    this.headerButtonAction.emit(HeaderCtaAction.Pay);
  }

  public paySelected() {
    this.headerButtonAction.emit(HeaderCtaAction.Pay);
  }

  public isDistribution = signal<boolean>(false);
  public calculatedDistribution = input();
  paymentTypeChanged(value: boolean): void {
    this.isDistribution.set(value);
  }

  public isOtpModalOpen = input<boolean>(false);
  public isPaymentModalHidden = input<boolean>(false);
}
