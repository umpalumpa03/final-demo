import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import {
  BillDetails,
  PaybillPayload,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { PaymentSummary } from '../../../../shared/ui/payment-summary/payment-summary';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { CurrencyPipe } from '@angular/common';
import { paymentOptionPaybill } from '../../config/input.config';
import {
  CONFIRM_PAYMENT_UI,
  mapConfirmSummaryFields,
} from '../../config/translate.config';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-paybill-confirm-payment',
  imports: [
    BasicCard,
    LibraryTitle,
    ButtonComponent,
    PaymentSummary,
    Dropdowns,
    CurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './paybill-confirm-payment.html',
  styleUrl: './paybill-confirm-payment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillConfirmPayment {
  // Inputs

  public readonly provider = input.required<PaybillProvider>();
  public readonly summary = input.required<PaybillPayload>();
  public readonly details = input.required<BillDetails>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');
  public readonly currentAccounts = input<
    { label: string; value: string }[] | null
  >(null);

  // Outputs

  public readonly confirm = output<void>();
  public readonly cancelPayment = output<void>();
  public readonly accountChanged = output<string>();
  public readonly selectedAccountId = model<string | null>(null);

  protected readonly selectConfig = paymentOptionPaybill;
  protected readonly ui = CONFIRM_PAYMENT_UI;

  public handleAccountChange(id: string): void {
    this.accountChanged.emit(id);
  }

  protected readonly summaryItems = computed(() =>
    mapConfirmSummaryFields(
      this.provider().name!,
      this.summary(),
      this.details(),
    ),
  );

  protected readonly title = 'Confirm Payment';
  protected readonly subtitle = 'Review the details before proceeding';
}
