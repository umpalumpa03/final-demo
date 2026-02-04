import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaybillDynamicField } from '../../components/shared/dynamic-inputs/models/dynamic-inputs.model';

@Injectable({
  providedIn: 'root',
})
export class PaybillDynamicForm {
  public syncFormControls(
    form: FormGroup,
    fields: PaybillDynamicField[],
  ): void {
    Object.keys(form.controls).forEach((key) => {
      if (key !== 'amount') form.removeControl(key);
    });

    fields.forEach((field) => {
      form.addControl(
        field.id,
        new FormControl('', field.required ? [Validators.required] : []),
      );
    });
  }

  public buildIdentification<
    T extends Record<string, string | number | boolean | null | undefined>,
  >(formValues: T): Record<string, string | undefined> {
    const { amount, ...identification } = formValues;
    const sanitized: Record<string, string | undefined> = {};

    Object.keys(identification).forEach((key) => {
      const value = identification[key];
      sanitized[key] =
        value === null || value === undefined ? undefined : String(value);
    });

    return sanitized;
  }
}
