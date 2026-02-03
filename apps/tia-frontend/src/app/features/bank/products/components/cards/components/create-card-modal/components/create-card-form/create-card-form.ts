import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardForm } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-form.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';



@Component({
  selector: 'app-create-card-form',
  templateUrl: './create-card-form.html',
  styleUrls: ['./create-card-form.scss'],
  imports: [ReactiveFormsModule, TextInput, Dropdowns, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCardForm {
  readonly formGroup = input.required<FormGroup<CardForm>>();
  readonly categoryOptions = input.required<SelectOption[]>();
  readonly typeOptions = input.required<SelectOption[]>();
  readonly accountOptions = input.required<SelectOption[]>();
  readonly isCreating = input.required<boolean>();
  readonly createError = input<string | null>(null);

  readonly formSubmit = output<void>();
  readonly formCancel = output<void>();

  protected onSubmit(): void {
    if (this.formGroup().valid) {
      this.formSubmit.emit();
    }
  }

  protected onCancel(): void {
    this.formCancel.emit();
  }
}
