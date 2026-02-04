import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { PaybillDynamicForm } from '../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaybillDynamicField } from '../../../services/paybill-dynamic-form/models/dynamic-form.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';

@Component({
  selector: 'app-dynamic-inputs',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './dynamic-inputs.html',
  styleUrl: './dynamic-inputs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputs {
  private readonly dynamicFormService = inject(PaybillDynamicForm);

  public readonly form = input.required<FormGroup>();
  public readonly fields = input.required<PaybillDynamicField[]>();
  public readonly state = input<'default' | 'disabled'>('default');

  protected readonly fieldConfigs = computed(() =>
    this.fields().map((field) => ({
      id: field.id,
      config: this.dynamicFormService.mapFieldToConfig(field),
    })),
  );
}
