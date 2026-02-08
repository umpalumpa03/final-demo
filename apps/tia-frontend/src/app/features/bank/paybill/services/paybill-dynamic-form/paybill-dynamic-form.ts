import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaybillIdentification } from '../../components/paybill-main/shared/models/paybill.model';
import {
  PaybillDynamicField,
  PaybillDynamicFormValues,
} from './models/dynamic-form.model';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
import {
  selectPaymentFields,
  selectVerifiedDetails,
} from '../../store/paybill.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class PaybillDynamicForm {
  private readonly store = inject(Store);

  public syncFormControls(
    form: FormGroup,
    fields: PaybillDynamicField[],
  ): void {
    fields.forEach((field) => {
      const validators = [];

      if (field.required) validators.push(Validators.required);
      if (field.minLength)
        validators.push(Validators.minLength(field.minLength));
      if (field.maxLength)
        validators.push(Validators.maxLength(field.maxLength));

      form.addControl(field.id, new FormControl('', validators));
    });
  }

  public buildIdentification(
    formValues: PaybillDynamicFormValues,
  ): PaybillIdentification {
    const { ...identification } = formValues;
    const sanitized: PaybillIdentification = {};

    Object.keys(identification).forEach((key) => {
      const value = identification[key];

      sanitized[key] =
        value === null || value === undefined ? undefined : String(value);
    });

    return sanitized;
  }

  public mapFieldToConfig(field: PaybillDynamicField): InputConfig {
    return {
      label: field.label,
      placeholder: field.placeholder || field.label,
      required: field.required,
      min: field.minLength,
      max: field.maxLength,
      errorMessage: 'Please fill required fields!',
    };
  }

  public updateAmountValidators(form: FormGroup, isVerified: boolean): void {
    const amountControl = form.controls['amount'];
    if (!amountControl) return;

    const validators = isVerified
      ? [Validators.required, Validators.min(0.01), Validators.max(9999)]
      : [Validators.required, Validators.max(9999)];

    amountControl.setValidators(validators);
    amountControl.updateValueAndValidity({ emitEvent: false });
  }

  public syncFormWithPaymentFields(
    form: FormGroup,
    initialFields: Record<string, string | number>,
    amountValidator?: boolean,
  ): void {
    const fields = this.store.selectSignal(selectPaymentFields)();
    const details = this.store.selectSignal(selectVerifiedDetails)();
    const isVerified = !!details?.valid;

    this.syncFormControls(form, fields);
    if (amountValidator) {
      this.updateAmountValidators(form, isVerified);
    }

    if (isVerified && details.amountDue !== undefined) {
      const values = amountValidator
        ? { amount: details.amountDue }
        : initialFields;
      form.patchValue(values, { emitEvent: false });
    }
  }
}
