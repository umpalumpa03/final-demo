import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from "./contact-form/contact-form";
import { RegistrationForm } from './registration-form/registration-form';
import { InlineForm } from "./inline-form/inline-form";
import { ValidationForm } from "./validation-form/validation-form";

@Component({
  selector: 'app-forms',
  imports: [ContactForms, RegistrationForm, InlineForm, ValidationForm],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forms {
  public readonly title = 'Forms';
  public readonly subtitle =
    'Complete form examples with various input types and layouts';
}
