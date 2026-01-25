import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";
import { VALIDATION_FORM } from '../models/forms.config';

@Component({
  selector: 'app-validation-form',
  imports: [TextInput, ReactiveFormsModule],
  templateUrl: './validation-form.html',
  styleUrl: './validation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationForm {
  private fb = inject(FormBuilder);
  public validationConfig = VALIDATION_FORM;

  public contactForm = this.fb.nonNullable.group({
    valid: ['john@example.com'],
    invalid: ['invalidemail'],
    warning: ['test@temp-mail.com'],
  });
}
