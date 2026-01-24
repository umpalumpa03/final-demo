import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationForm } from './registration-form';
import { COUNTRIES } from '../models/contact-forms.model';
import { vi } from 'vitest';

describe('RegistrationForm', () => {
  let component: RegistrationForm;
  let fixture: ComponentFixture<RegistrationForm>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('inputConfigs should contain correct placeholders', () => {
    expect(component.inputConfigs.firstName.placeholder).toBe('Jhon');
    expect(component.inputConfigs.lastName.placeholder).toBe('Doe');
    expect(component.inputConfigs.email.placeholder).toBe('jonh@example.com');
    expect(component.inputConfigs.password.placeholder).toBe('••••••••');
    expect(component.inputConfigs.confirmPassword.placeholder).toBe('••••••••');
  });

  it('should expose countries constant', () => {
    expect(component.countries).toEqual(COUNTRIES);
  });

  it('showError returns true when control is invalid and touched', () => {
    const control = component.registrationForm.get('firstName');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.showError('firstName')).toBe(true);
  });

  it('confirmPasswordState returns "error" when invalid', () => {
    const confirm = component.registrationForm.get('confirmPassword');
    confirm?.setValue('');
    confirm?.markAsTouched();
    fixture.detectChanges();

    expect(component.confirmPasswordState).toBe('error');
  });

  it('submit does not emit when form is invalid', () => {
    const spy = vi.spyOn(component.submitRegistrationForm, 'emit');

    // Reset form to make it invalid
    component.registrationForm.reset();
    component.submit();

    expect(spy).not.toHaveBeenCalled();

    const control = component.registrationForm.get('firstName');
    expect(control?.touched).toBe(true);
  });

  it('confirmPasswordState returns "error" when passwords do not match', () => {
  const form = component.registrationForm;

  form.setValue({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Abcdef1!',
    confirmPassword: 'Different1!',
    country: COUNTRIES[0].code,
    birthDate: '1990-01-01',
    termsAndConditions: true,
  });

  form.setErrors({ PasswordNoMatch: true });
  form.get('confirmPassword')?.markAsTouched();

  expect(component.confirmPasswordState).toBe('error');
})
});
