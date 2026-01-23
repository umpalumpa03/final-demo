import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from "./contact-forms/contact-forms";
import { RegistrationForm } from './registration-form/registration-form';
import { InlineForm } from "./inline-form/inline-form";

@Component({
  selector: 'app-forms',
  imports: [ContactForms, RegistrationForm, InlineForm],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Forms {}
