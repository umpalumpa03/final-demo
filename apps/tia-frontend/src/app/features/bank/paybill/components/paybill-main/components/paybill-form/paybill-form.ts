import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  BillDetails,
  PaybillProvider,
} from '../../shared/models/paybill.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { paybillInputConfig } from './config/input.config';
import { PaymentSummary } from '../../shared/ui/payment-summary/payment-summary';
import { CurrencyPipe } from '@angular/common';
import { mapBillSummaryFields } from './utils/paybill-form.config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';

@Component({
  selector: 'app-paybill-form',
  imports: [
    ButtonComponent,
    BasicCard,
    ReactiveFormsModule,
    TextInput,
    PaymentSummary,
    CurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './paybill-form.html',
  styleUrl: './paybill-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillForm {
  public readonly provider = input<PaybillProvider | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly iconBgColor = input<string>('#F0F9FF');
  public readonly iconBgPath = input<string>();
  public readonly verifiedDetails = input<
    BillDetails | null,
    BillDetails | null
  >(null, {
    transform: (details) => {
      if (details?.valid) {
        this.paybillForm.patchValue(
          { amount: details.amountDue },
          { emitEvent: false },
        );
      }
      return details;
    },
  });

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  public readonly verify = output<{ accountNumber: string }>();
  public readonly pay = output<{ accountNumber: string; amount: number }>();
  public readonly saveTemplate = output<void>();

  public paybillForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(5)]],
    amount: [0, [Validators.min(0.01)]],
  });

  public readonly paybillConfig = toSignal(
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.getCurrentLang(), translations: null }),
      map(() =>
        translateConfig(paybillInputConfig, (key) =>
          this.translate.instant(key),
        ),
      ),
    ),
    {
      initialValue: translateConfig(paybillInputConfig, (key) =>
        this.translate.instant(key),
      ),
    },
  );

  public readonly isVerified = computed(() => !!this.verifiedDetails()?.valid);
  protected readonly summaryItems = computed(() =>
    mapBillSummaryFields(this.verifiedDetails()),
  );

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
