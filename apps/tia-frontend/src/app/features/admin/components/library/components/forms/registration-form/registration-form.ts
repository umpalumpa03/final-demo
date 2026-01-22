import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COUNTRIES } from '../models/contact-forms.model';

@Component({
  selector: 'app-registration-form',
  imports: [],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationForm {
  public countries = COUNTRIES;
}
