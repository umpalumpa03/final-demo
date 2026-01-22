import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { getErrorMessage } from '../../../../../../../core/utils/form-validations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactForm } from '../models/contact-forms.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input/text-input';

@Component({
  selector: 'app-contact-forms',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './contact-forms.html',
  styleUrl: './contact-forms.scss',
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

  public readonly nameError = getErrorMessage(this.name, 'name');
  public readonly emailError = getErrorMessage(this.email, 'email');
  public readonly messageError = getErrorMessage(this.message, 'message');

  public get name() {
    return this.contactForm.controls.name;
  }
  public get email() {
    return this.contactForm.controls.email;
  }
  public get message() {
    return this.contactForm.controls.message;
  }
  public get subscribe() {
    return this.contactForm.controls.subscribe;
  }

  public get isNameError() {
    return this.showError('name');
  }

  public get isEmailError() {
    return this.showError('email');
  }

  public get isMessageError() {
    return this.showError('message');
  }

  public get isSubscribeError() {
    return this.showError('subscribe');
  }

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
