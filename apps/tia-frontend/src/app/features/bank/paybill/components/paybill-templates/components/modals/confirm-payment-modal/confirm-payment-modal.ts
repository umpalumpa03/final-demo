import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { SelectedItems } from '../../../ui/selected-items/selected-items';
import { PaymentDistribution } from '../../../ui/payment-distribution/payment-distribution';
import { BillsList } from '../../../ui/bills-list/bills-list';
import { TotalAmount } from '../../../ui/total-amount/total-amount';
import { AccountSelect } from '../../../../shared/account-select/account-select';
import { ModalActions } from '../../../ui/modal/modal-actions';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
import { selectIsFormValid } from '../../../../../store/paybill.selectors';
import { Store } from '@ngrx/store';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';

@Component({
  selector: 'app-confirm-payment-modal',
  imports: [
    SelectedItems,
    PaymentDistribution,
    BillsList,
    TotalAmount,
    AccountSelect,
    ModalActions,
    ScrollArea,
  ],
  templateUrl: './confirm-payment-modal.html',
  styleUrl: './confirm-payment-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPaymentModal {
  public store = inject(Store);
  public selectedItemsLength = input.required<number>();
  public isDistribution = input.required<boolean>();
  public submitVariant = input.required<ButtonVariant>();
  public submitLabel = input.required<string>();
  public isLoading = input<boolean>(false);

  public cancel = output<void>();
  public submit = output<void>();
  public distributionChange = output<boolean>();

  public isFormValid = this.store.selectSignal(selectIsFormValid);
}
