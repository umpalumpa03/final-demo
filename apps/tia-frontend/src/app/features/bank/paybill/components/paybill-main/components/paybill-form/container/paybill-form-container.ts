import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { PaybillForm } from '../components/paybill-form-items/paybill-form';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import {
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
} from '../../../shared/models/paybill.model';
import { PaybillDynamicForm } from '../../../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-paybill-form-container',
  imports: [PaybillForm],
  templateUrl: './paybill-form-container.html',
  styleUrl: './paybill-form-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillFormContainer {
  // dependencies
  protected readonly paybillFacade = inject(PaybillMainFacade);
  protected readonly dynamicForm = inject(PaybillDynamicForm);
  private readonly fb = inject(NonNullableFormBuilder);

  // sync form data with service
  private readonly formSync = effect(() => {
    const fields = this.paybillFacade.paymentFields();
    const details = this.paybillFacade.verifiedDetails();
    const isVerified = !!details?.valid;

    this.dynamicForm.syncFormControls(this.paybillForm, fields);
    this.dynamicForm.updateAmountValidators(this.paybillForm, isVerified);

    if (isVerified && details?.amountDue !== undefined) {
      this.paybillForm.patchValue(
        { amount: details.amountDue },
        { emitEvent: false },
      );
    }
  });

  public readonly paybillForm = this.fb.group({
    amount: [0, [Validators.required, Validators.max(9999)]],
  });

  public onVerifyAccount(event: PaybillFormVerifyEvent): void {
    const identification = this.dynamicForm.buildIdentification(event.value);
    this.paybillFacade.verifyAccount(identification);
  }

  public onSaveAsTemplate(nickname: string): void {
    this.paybillFacade.saveAsTemplate(nickname);
  }

  public onProceedToPayment(event: PaybillFormProceedEvent): void {
    const identification = this.dynamicForm.buildIdentification(event.value);
    this.paybillFacade.proceedToPayment(event.amount, identification);
  }
}
