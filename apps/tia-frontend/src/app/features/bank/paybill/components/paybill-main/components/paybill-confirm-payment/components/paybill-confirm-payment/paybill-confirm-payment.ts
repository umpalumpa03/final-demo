import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  untracked,
} from '@angular/core';
import {
  BillDetails,
  PaybillPayload,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
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
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-paybill-confirm-payment',
  imports: [
    BasicCard,
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
export class PaybillConfirmPayment implements OnInit {
  private readonly store = inject(Store);

  // Inputs

  public readonly provider = input.required<PaybillProvider>();
  public readonly summary = input.required<PaybillPayload>();
  public readonly details = input.required<BillDetails>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');
  public readonly currentAccounts = input<
    { label: string; value: string; isFavorite: boolean }[] | null
  >(null);
  public readonly isLoading = input<boolean>(false);

  // Outputs

  public readonly confirm = output<void>();
  public readonly cancelPayment = output<void>();
  public readonly accountChanged = output<string>();
  public readonly selectedAccountId = model<string | null>(null);

  protected readonly selectConfig = paymentOptionPaybill;
  protected readonly ui = CONFIRM_PAYMENT_UI;

  constructor() {
    effect(() => {
      const accounts = this.currentAccounts();

      if (accounts && accounts.length > 0 && !this.selectedAccountId()) {
        const favoriteAccount = accounts.find((acc) => acc.isFavorite);

        if (favoriteAccount) {
          untracked(() => {
            this.selectedAccountId.set(favoriteAccount.value);
            this.handleAccountChange(favoriteAccount.value);
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

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
}
