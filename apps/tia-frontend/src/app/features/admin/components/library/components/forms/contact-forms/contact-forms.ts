import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-forms',
  imports: [],
  templateUrl: './contact-forms.html',
  styleUrl: './contact-forms.scss',
})
export class ContactForms {
  private fb = inject(FormBuilder);
  public firstFildName = input<string>();
  public contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    message: '',
    subscribe: false,
  });
}
