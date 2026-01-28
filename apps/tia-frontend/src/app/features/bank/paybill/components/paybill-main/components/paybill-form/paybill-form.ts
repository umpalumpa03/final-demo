import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { BillDetails, PaybillProvider } from '../../../../models/paybill.model';
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
  public readonly provider = input<PaybillProvider | null>(null);
  public readonly verifiedDetails = input<BillDetails | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly iconBgColor = input<string>('#F0F9FF');
  public readonly iconBgPath = input<string>();
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly verify = output<{ accountNumber: string }>();
  public readonly pay = output<{ accountNumber: string; amount: number }>();
  public readonly saveTemplate = output<void>();

  public paybillForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(5)]],
    amount: [0, [Validators.min(0.01)]],
  });

  public readonly isVerified = computed(() => !!this.verifiedDetails()?.valid);

  constructor() {
    effect(() => {
      const details = this.verifiedDetails();
      if (details?.valid) {
        this.paybillForm.patchValue({ amount: details.amountDue });
      }
    });
  }

  public onSubmit(): void {
    if (this.isLoading()) return;

    const accountNumberControl = this.paybillForm.controls.accountNumber;

    if (!this.isVerified()) {
      if (accountNumberControl.valid) {
        this.verify.emit({ accountNumber: accountNumberControl.value });
      } else {
        accountNumberControl.markAsTouched();
      }
    } else {
      if (this.paybillForm.valid) {
        this.pay.emit(this.paybillForm.getRawValue());
      } else {
        this.paybillForm.markAllAsTouched();
      }
    }
  }
}
