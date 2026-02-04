import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import { PaybillDynamicField } from './models/dynamic-inputs.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-inputs',
  imports: [],
  templateUrl: './dynamic-inputs.html',
  styleUrl: './dynamic-inputs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputs {
  public readonly fields = input.required<PaybillDynamicField[]>();
  public readonly parentForm = input.required<FormGroup>();

  private readonly buildControls = effect(() => {
    const currentFields = this.fields();
    const form = this.parentForm();

    currentFields.forEach((field) => {
      if (!form.contains(field.id)) {
        form.addControl(
          field.id,
          new FormControl('', field.required ? [Validators.required] : []),
        );
      }
    });
  });
}
