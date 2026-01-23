import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from './contact-forms/contact-forms';
import { RegistrationForm } from './registration-form/registration-form';
import { LibraryTitle } from '../../shared/library-title/library-title';

@Component({
  selector: 'app-forms',
  imports: [ContactForms, RegistrationForm, LibraryTitle],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forms {
  public readonly title = 'Forms';
  public readonly subtitle =
    'Complete form examples with various input types and layouts';
}
