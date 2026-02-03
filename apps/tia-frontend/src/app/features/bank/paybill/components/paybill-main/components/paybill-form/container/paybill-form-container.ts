import { Component, inject, OnDestroy } from '@angular/core';
import { PaybillForm } from '../components/paybill-form-items/paybill-form';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import {
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
} from '../../../shared/models/paybill.model';

@Component({
  selector: 'app-paybill-form-container',
  imports: [PaybillForm],
  templateUrl: './paybill-form-container.html',
  styleUrl: './paybill-form-container.scss',
})
export class PaybillFormContainer implements OnDestroy {
  protected readonly paybillFacade = inject(PaybillMainFacade);

  public onVerifyAccount(data: PaybillFormVerifyEvent): void {
    this.paybillFacade.verifyAccount(data.value);
  }

  public onProceedToPayment(data: PaybillFormProceedEvent): void {
    this.paybillFacade.proceedToPayment(data.amount, data.value);
  }

  ngOnDestroy(): void {
    this.paybillFacade.resetPaymentForm();
  }
}
