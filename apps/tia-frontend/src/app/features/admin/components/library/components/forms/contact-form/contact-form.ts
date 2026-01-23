import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { getErrorMessage } from '../../../../../../../shared/utils/form-validations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactForm } from '../models/contact-forms.model';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForms {
  private fb = inject(FormBuilder);
  public submitForm = output<IContactForm>();

  public contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(50)]],
    subscribe: [false, [Validators.requiredTrue]],
  });

  public get message() {
    return this.contactForm.controls.message;
  }
  public get subscribe() {
    return this.contactForm.controls.subscribe;
  }

  public get isMessageError() {
    return this.showError('message');
  }

  public get isSubscribeError() {
    return this.showError('subscribe');
  }

  public readonly messageError = getErrorMessage(this.message, 'message');

  public showError(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  public submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.contactForm.getRawValue());
    this.contactForm.reset();
  }

  //this is temporary configs
  public nameConfig = {
    label: 'Name',
    required: true,
    placeholder: 'Your Name',
  };

  public emailConfig = {
    label: 'Email',
    required: true,
    placeholder: 'your.email@example.com',
  };
}
