import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactForm } from '../models/contact-forms.model';

@Component({
  selector: 'app-contact-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-forms.html',
  styleUrl: './contact-forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactForms {
  private fb = inject(FormBuilder);
  public firstFildName = input<string>();
  public submitForm = output<IContactForm>();

  public contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(50)]],
    subscribe: [false, [Validators.requiredTrue]],
  });

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
}
