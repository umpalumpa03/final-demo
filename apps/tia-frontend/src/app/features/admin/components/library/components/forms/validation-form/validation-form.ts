import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";

@Component({
  selector: 'app-validation-form',
  imports: [TextInput, ReactiveFormsModule],
  templateUrl: './validation-form.html',
  styleUrl: './validation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationForm {
  private fb = inject(FormBuilder);

  public contactForm = this.fb.nonNullable.group({
    valid: ['john@example.com'],
    invalid: ['invalidemail'],
    warning: ['test@temp-mail.com'],
  });

  //this is temporary configs
  public successConfig = {
    label: 'Valid Input',
  };

  public errorConfig = {
    label: 'Invalid Input',
    errorMessage: 'Please enter a valid email address',
  };

  public warningConfig = {
    label: 'Warning Input',
    errorMessage: 'Temporary email addresses may not receive notifications',
  };
}
