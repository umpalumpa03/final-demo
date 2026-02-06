import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaybillConfirmPayment } from '../components/paybill-confirm-payment/paybill-confirm-payment';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Store } from '@ngrx/store';
import { PaybillActions } from '../../../../../store/paybill.actions';

@Component({
  selector: 'app-paybill-confirm-payment-container',
  imports: [PaybillConfirmPayment],
  templateUrl: './paybill-confirm-payment-container.html',
  styleUrl: './paybill-confirm-payment-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillConfirmPaymentContainer {
  protected readonly facade = inject(PaybillMainFacade);
  private readonly store = inject(Store);

  public confirmPayment(): void {
    const provider = this.facade.activeProvider();
    const data = this.facade.paymentPayload();
    const senderId = this.facade.selectedSenderAccountId();

    if (provider && data && senderId) {
      this.store.dispatch(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: provider.id,
            identification: data.identification,
            amount: data.amount,
            senderAccountId: senderId,
          },
        }),
      );
    }
  }

  public onBackToDetails(): void {
    this.facade.backToDetails();
  }
}
