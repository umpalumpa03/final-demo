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
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
import {
  FormGroup,
  ReactiveFormsModule,
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
import {
  PaybillDynamicField,
} from '../../../../../../services/paybill-dynamic-form/models/dynamic-form.model';
import { DynamicInputs } from '../../../../../shared/dynamic-inputs/dynamic-inputs';
import { Skeleton } from "@tia/shared/lib/feedback/skeleton/skeleton";

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
    DynamicInputs,
    Skeleton,
],
  templateUrl: './paybill-form.html',
  styleUrl: './paybill-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillForm {
  protected readonly translate = inject(TranslateService);

  // inputs from smart parent

  public readonly paybillForm = input.required<FormGroup>();
  public readonly provider = input<PaybillProvider | null>(null);
  public readonly fields = input.required<PaybillDynamicField[]>();
  public readonly verifiedDetails = input<BillDetails | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly iconBgColor = input<string>('#F0F9FF');
  public readonly iconBgPath = input<string>();
  public readonly saveTemplate = output<string>();

  // output buton events

  public readonly verify = output<PaybillFormVerifyEvent>();
  public readonly pay = output<PaybillFormProceedEvent>();

  // computed dynamic signal data

  public readonly isVerified = computed(() => !!this.verifiedDetails()?.valid);

  protected readonly summaryItems = computed(() =>
    mapBillSummaryFields(this.verifiedDetails()),
  );

  public readonly paybillConfig = toSignal(
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.getCurrentLang() }),
      map(() =>
        translateConfig(paybillInputConfig, (k) => this.translate.instant(k)),
      ),
    ),
    {
      initialValue: translateConfig(paybillInputConfig, (k) =>
        this.translate.instant(k),
      ),
    },
  );

  public onSaveTemplate(): void {
    const defaultNickname = this.provider()?.name || '';    
    this.saveTemplate.emit(defaultNickname);
  }

  public onSubmit(): void {
    if (this.isLoading()) return;

    const form = this.paybillForm();
    const formValues = form.getRawValue();

    if (!this.isVerified()) {
      if (form.valid) {
        this.verify.emit({ value: formValues });
      } else {
        form.markAllAsTouched();
      }
    } else if (form.valid) {
      this.pay.emit({
        amount: formValues.amount ?? 0,
        value: formValues,
      });
    }
  }
}
