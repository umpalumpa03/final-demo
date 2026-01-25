import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationForm } from './registration-form';
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
});
