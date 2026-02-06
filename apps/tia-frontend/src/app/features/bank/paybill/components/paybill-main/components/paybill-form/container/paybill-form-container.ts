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
import { PaybillDynamicFormValues } from '../../../../../services/paybill-dynamic-form/models/dynamic-form.model';
import { Store } from '@ngrx/store';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../../../store/paybill.actions';
import { buildDynamicIdentification } from '../../../../../config/paybill.config';
import { Router } from '@angular/router';

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
  private store = inject(Store);
  private router = inject(Router);

  public proceedToPayment(
    amount: number,
    formValues: PaybillDynamicFormValues,
  ): void {
    const provider = this.paybillFacade.activeProvider();

    if (provider) {
      this.store.dispatch(PaybillActions.setTransactionProvider({ provider }));

      this.store.dispatch(
        PaybillActions.setPaymentPayload({
          data: {
            identification: buildDynamicIdentification(formValues),
            amount: amount,
          },
        }),
      );

      this.store.dispatch(PaybillActions.setPaymentStep({ step: 'CONFIRM' }));
      this.router.navigate(['/bank/paybill/pay/confirm-payment']);
    }
  }

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

  public saveAsTemplate(customNickname?: string): void {
    const provider = this.paybillFacade.activeProvider();
    const payload = this.paybillFacade.paymentPayload();

    if (provider && payload) {
      this.store.dispatch(
        TemplatesPageActions.createTemplate({
          serviceId: provider.id,
          identification: payload.identification,
          nickname: customNickname || provider.name || 'My Template',
        }),
      );
    } else {
      return;
    }
  }

  public readonly paybillForm = this.fb.group({
    amount: [0, [Validators.required, Validators.max(9999)]],
  });

  public onVerifyAccount(event: PaybillFormVerifyEvent): void {
    const identification = this.dynamicForm.buildIdentification(event.value);
    this.verifyAccount(identification);
  }

  public onSaveAsTemplate(nickname: string): void {
    this.saveAsTemplate(nickname);
  }

  public onProceedToPayment(event: PaybillFormProceedEvent): void {
    const identification = this.dynamicForm.buildIdentification(event.value);
    this.proceedToPayment(event.amount, identification);
  }

  public verifyAccount(formValues: PaybillDynamicFormValues): void {
    const provider = this.paybillFacade.activeProvider();

    const identification = this.dynamicForm.buildIdentification(formValues);

    if (provider) {
      this.store.dispatch(
        PaybillActions.checkBill({
          serviceId: provider.id,
          identification,
        }),
      );

      this.store.dispatch(
        PaybillActions.setPaymentPayload({
          data: {
            identification,
            amount: formValues.amount || 0,
          },
        }),
      );
    }
  }
}
