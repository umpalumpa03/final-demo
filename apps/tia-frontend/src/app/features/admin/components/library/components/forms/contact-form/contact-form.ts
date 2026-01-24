import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { getErrorMessage } from '../../../../../../../shared/utils/form-validations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactForm } from '../models/contact-forms.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CONTACT_FORM } from '../models/configs';

@Component({
  selector: 'app-contact-form',
  imports: [
    ReactiveFormsModule,
    TextInput,
    Textarea,
    Checkboxes,
    ButtonComponent,
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForms {
  private fb = inject(FormBuilder);
  public submitForm = output<IContactForm>();
  public nameConfig = CONTACT_FORM;

  public contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(50)]],
    subscribe: [false, [Validators.required]],
  });

  public submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.contactForm.getRawValue());
    this.contactForm.reset();
  }
}
