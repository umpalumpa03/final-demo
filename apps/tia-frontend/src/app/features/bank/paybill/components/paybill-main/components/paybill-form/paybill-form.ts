import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { PaybillProvider } from '../../../../models/paybill.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';

@Component({
  selector: 'app-paybill-form',
  imports: [ButtonComponent, BasicCard, ReactiveFormsModule, TextInput],
  templateUrl: './paybill-form.html',
  styleUrl: './paybill-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillForm {
  public readonly provider = input<PaybillProvider>();
  public readonly iconBgColor = input<string>('#F0F9FF');
  public readonly iconBgPath = input<string>();

  private readonly fb = inject(NonNullableFormBuilder);

  public readonly formSubmit = output<{ accountNumber: string }>();

  public paybillForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(5)]],
  });

  public onSubmit(): void {
    if (this.paybillForm.valid) {
      this.formSubmit.emit(this.paybillForm.getRawValue());
    } else {
      this.paybillForm.markAllAsTouched();
    }
  }
}
