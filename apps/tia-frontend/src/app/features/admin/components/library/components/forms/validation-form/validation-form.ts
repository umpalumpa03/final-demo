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
    valid: ['john@example.com', [Validators.email]],
    invalid: ['invalidemail', [Validators.required, Validators.email]],
    warning: ['', [Validators.required, Validators.minLength(50)]],
  });

  //this is temporary configs
  public successConfig = {
    label: 'Valid Input',
    placeholder: 'Your Name',
    errorMessage: 'Email format is correct',
  };

  public errorConfig = {
    label: 'Invalid Input',
    placeholder: 'your.email@example.com',
    errorMessage: 'Please enter a valid email address',
  };

  public warningConfig = {
    label: 'Warning Input',
    placeholder: 'test@temp-mail.com',
    errorMessage: 'Temporary email addresses may not receive notifications',
  };
}
