import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { FormsDemoState } from '../state/forms-demo.state';

@Component({
  selector: 'app-validation-form',
  imports: [TextInput, ReactiveFormsModule],
  templateUrl: './validation-form.html',
  styleUrl: './validation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationForm {
  private fb = inject(FormBuilder);
  public readonly validationConfig = inject(FormsDemoState).validationForm;

  public contactForm = this.fb.nonNullable.group({
    valid: ['john@example.com', Validators.email],
    invalid: ['invalidemail', Validators.email],
    warning: ['test@temp-mail.com', Validators.email],
  });
}
