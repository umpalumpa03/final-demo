import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import {
  IRegistrationForm,
} from '../models/contact-forms.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  passwordMatchValidator,
  passwordValidator,
} from '@tia/shared/utils/form-validations';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputState } from '@tia/shared/lib/forms/models/input.model';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { COUNTRY_OPTIONS, REGISTATION_FORM } from '../models/configs';

@Component({
  selector: 'app-registration-form',
  imports: [
    TextInput,
    ReactiveFormsModule,
    Checkboxes,
    ButtonComponent,
    Dropdowns,
  ],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  public countries = COUNTRY_OPTIONS;
  public inputConfig = REGISTATION_FORM;
  
  private readonly fb = inject(FormBuilder);
  public readonly submitRegistrationForm = output<IRegistrationForm>();

  public registrationForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), passwordValidator],
      ],
      confirmPassword: ['', [Validators.required]],
      country: ['', Validators.required],
      birthDate: ['', Validators.required],
      termsAndConditions: [false, Validators.required],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  public showError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  public get confirmPasswordState(): InputState {
    const control = this.registrationForm.get('confirmPassword');
    if (this.showError('confirmPassword')) return 'error';
    if (this.registrationForm.hasError('PasswordNoMatch') && control?.touched)
      return 'error';
    return 'default';
  }

  public submit() {
    if (this.registrationForm.invalid || !this.registrationForm.value) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.submitRegistrationForm.emit(this.registrationForm.getRawValue());
    this.registrationForm.reset();
  }
}
