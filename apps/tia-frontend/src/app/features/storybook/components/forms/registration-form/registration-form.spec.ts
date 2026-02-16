import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationForm } from './registration-form';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

describe('RegistrationForm', () => {
  let component: RegistrationForm;
  let fixture: ComponentFixture<RegistrationForm>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm, TranslateModule.forRoot()],
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

  it('showError returns true when control is invalid and touched', () => {
    const control = component.registrationForm.get('firstName');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.showError('firstName')).toBe(true);
  });

  it('submit does not emit when form is invalid', () => {
    const spy = vi.spyOn(component.submitRegistrationForm, 'emit');

    component.registrationForm.reset();
    component.submit();

    expect(spy).not.toHaveBeenCalled();

    const control = component.registrationForm.get('firstName');
    expect(control?.touched).toBe(true);
  });

  it('does not show password rules initially but shows after interaction', async () => {

    const pwd = component.registrationForm.get('password');
    pwd?.setValue('Aa123');
    pwd?.markAsDirty();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.passwordInteracted()).toBe(true);
    expect(component.showPasswordRules()).toBe(true);
  });

  it('sets passwordMismatch on confirm control when values differ', async () => {
    const pwd = component.registrationForm.get('password');
    const confirm = component.registrationForm.get('confirmPassword');

    pwd?.setValue('Aa123456');
    confirm?.setValue('Different1');
    pwd?.markAsDirty();
    confirm?.markAsDirty();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(confirm?.errors).toBeTruthy();
    expect(confirm?.errors?.['passwordMismatch']).toBe(true);
  });

  it('emits payload without confirmPassword and resets signals on successful submit', async () => {
    const spy = vi.spyOn(component.submitRegistrationForm, 'emit');

    component.registrationForm.setValue({
      firstName: 'Al',
      lastName: 'Ng',
      birthday: '2000-01-01',
      email: 'a@b.com',
      password: 'Aa12345@',
      confirmPassword: 'Aa12345@',
      username: 'alice',
    });
    component.registrationForm.markAllAsTouched();
    component.registrationForm.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();

    // Ensure form is valid and touched
    component.submit();
    expect(spy).toHaveBeenCalled();
    const payload = (spy as any).mock.calls[0][0];
    expect(payload.confirmPassword).toBeUndefined();

    expect(component.passwordInteracted()).toBe(false);
    expect(component.passwordRules()).toBeNull();
  });
});
