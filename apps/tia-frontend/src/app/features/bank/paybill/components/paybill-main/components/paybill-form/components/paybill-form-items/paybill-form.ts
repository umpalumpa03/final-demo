import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  BillDetails,
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { paybillInputConfig } from '../../config/input.config';
import { PaymentSummary } from '../../../../shared/ui/payment-summary/payment-summary';
import { CurrencyPipe } from '@angular/common';
import { mapBillSummaryFields } from '../../utils/paybill-form.config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';
import { PaybillDynamicForm } from '../../../../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { PaybillDynamicField } from '../../../../../../services/paybill-dynamic-form/models/dynamic-form.model';

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
  private readonly dynamicFormService = inject(PaybillDynamicForm);
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
  public readonly fields = input.required<PaybillDynamicField[]>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  public readonly verify = output<PaybillFormVerifyEvent>();
  public readonly pay = output<PaybillFormProceedEvent>();
  public readonly saveTemplate = output<void>();

  public paybillForm: FormGroup = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  private readonly updateValidators = effect(() => {
    const amountControl = this.paybillForm.controls['amount'];
    if (this.isVerified()) {
      amountControl.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999),
      ]);
    } else {
      amountControl.setValidators([Validators.required, Validators.max(9999)]);
    }
    amountControl.updateValueAndValidity();
  });

  private readonly buildControls = effect(() => {
    this.dynamicFormService.syncFormControls(this.paybillForm, this.fields());
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
    const formValues = this.paybillForm.getRawValue();

    if (!this.isVerified()) {
      if (this.paybillForm.valid) {
        this.verify.emit({ value: formValues });
      } else {
        this.paybillForm.markAllAsTouched();
      }
    }
  }

  protected readonly fieldConfigs = computed(() =>
    this.fields().map((field) => ({
      id: field.id,
      config: this.dynamicFormService.mapFieldToConfig(field),
    })),
  );
}
