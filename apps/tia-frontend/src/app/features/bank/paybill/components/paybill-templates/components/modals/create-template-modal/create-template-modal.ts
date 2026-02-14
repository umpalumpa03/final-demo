import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/dropdowns.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { DynamicInputs } from '../../../../shared/dynamic-inputs/dynamic-inputs';
import { ModalActions } from '../../../ui/modal/modal-actions';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
import { ModalField } from '../../../models/paybill-templates.model';
import { PaybillDynamicField } from '../../../../../services/paybill-dynamic-form/models/dynamic-form.model';

@Component({
  selector: 'app-create-template-modal',
  imports: [
    Dropdowns,
    DynamicInputs,
    ModalActions,
    TextInput,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './create-template-modal.html',
  styleUrl: './create-template-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTemplateModal {
  public form = input.required<FormGroup>();
  public fields = input<ModalField[]>();
  public isCategorySelected = input<boolean>(false);
  public childProviderOptions = input<SelectOption[][]>([]);
  public createTemplateForm = input.required<FormGroup>();
  public paymentFields = input<PaybillDynamicField[]>([]);
  public submitVariant = input.required<ButtonVariant>();
  public submitLabel = input.required<string>();
  public isLoading = input<boolean>(false);
  public dropdownOptionsMap = input.required<Record<string, SelectOption[]>>();

  public cancel = output<void>();
  public formSubmit = output<void>();
  public childProviderChange = output<{ value: any; index: number }>();

  public getDropdownOptions(controlName: string): SelectOption[] {
    return this.dropdownOptionsMap()[controlName] ?? [];
  }
}
