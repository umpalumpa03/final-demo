import { Component, inject } from '@angular/core';
import { PaybillConfirmPayment } from '../components/paybill-confirm-payment/paybill-confirm-payment';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

@Component({
  selector: 'app-paybill-confirm-payment-container',
  imports: [PaybillConfirmPayment],
  templateUrl: './paybill-confirm-payment-container.html',
  styleUrl: './paybill-confirm-payment-container.scss',
})
export class PaybillConfirmPaymentContainer {
  protected readonly facade = inject(PaybillMainFacade);

  public onFinalConfirm(): void {
    this.facade.confirmPayment();
  }

  public onBackToDetails(): void {
    this.facade.backToDetails();
  }
}
