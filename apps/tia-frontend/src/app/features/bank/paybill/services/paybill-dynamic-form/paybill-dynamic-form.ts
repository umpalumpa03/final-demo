import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaybillIdentification } from '../../components/paybill-main/shared/models/paybill.model';
import {
  PaybillDynamicField,
  PaybillDynamicFormValues,
} from './models/dynamic-form.model';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';

@Injectable({
  providedIn: 'root',
})
export class PaybillDynamicForm {
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
    const { amount, ...identification } = formValues;
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
}
