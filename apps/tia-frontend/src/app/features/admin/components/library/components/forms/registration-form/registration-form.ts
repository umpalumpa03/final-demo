import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COUNTRIES } from '../models/contact-forms.model';

@Component({
  selector: 'app-registration-form',
  imports: [],
  templateUrl: './Registration-form.html',
  styleUrl: './Registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationForm {
  public countries = COUNTRIES;
}
