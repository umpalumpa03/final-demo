import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { COUNTRIES, IRegitrationForm } from '../models/contact-forms.model';
import { FormBuilder, Validators } from '@angular/forms';
import { getErrorMessage } from 'apps/tia-frontend/src/app/core/utils/form-validations';

@Component({
  selector: 'app-registration-form',
  imports: [],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  public countries = COUNTRIES;
  private fb = inject(FormBuilder);
  public submitRegistrationForm = output<IRegitrationForm>();

  public registrationForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: [false, [Validators.requiredTrue]],
    country: ['', Validators.required],
    birthDate: ['', Validators.required],
  });

  public readonly firstNameError = getErrorMessage(this.firsName, 'firstName');
  public readonly lastNameError = getErrorMessage(this.lastName, 'lastName');
  public readonly emailError = getErrorMessage(this.email, 'email');
  public readonly passwordError = getErrorMessage(this.password, 'password');
  public readonly confirmPasswordError = getErrorMessage(
    this.confirmPassword,
    'confirmPassword',
  );
  public readonly birthDateError = getErrorMessage(this.birthDate, 'birthDate');

  public get firsName() {
    return this.registrationForm.controls.firstName;
  }

  public get lastName() {
    return this.registrationForm.controls.lastName;
  }

  public get email() {
    return this.registrationForm.controls.email;
  }

  public get password() {
    return this.registrationForm.controls.password;
  }

  public get confirmPassword() {
    return this.registrationForm.controls.confirmPassword;
  }

  public get country() {
    return this.registrationForm.controls.country;
  }

  public get birthDate() {
    return this.registrationForm.controls.country;
  }

  public get isFirstNameError() {
    return this.showError('firstName');
  }

  public get isLastNameError() {
    return this.showError('lastName');
  }

  public get isEmailError() {
    return this.showError('email');
  }

  public get isPasswordError() {
    return this.showError('password');
  }

  public get isConfirmPasswordError() {
    return this.showError('confirmPassword');
  }

  public get isCountryError() {
    return this.showError('country');
  }

  public get isBirthDateError() {
    return this.showError('birthDate');
  }

  public showError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  public submit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.submitRegistrationForm.emit(this.registrationForm.getRawValue());
    this.registrationForm.reset();
  }
}
