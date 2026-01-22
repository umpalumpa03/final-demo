import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from "./contact-forms/contact-forms";
import { RegistrationForm } from "./registration-forms/Registration-form";

@Component({
  selector: 'app-forms',
  imports: [ContactForms, RegistrationForm],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Forms {}
