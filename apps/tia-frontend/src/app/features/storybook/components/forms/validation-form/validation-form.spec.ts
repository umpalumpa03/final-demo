import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationForm } from './validation-form';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ValidationForm', () => {
  let component: ValidationForm;
  let fixture: ComponentFixture<ValidationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationForm, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values from config', () => {
    const formValues = component.contactForm.getRawValue();
    expect(formValues.valid).toBe('john@example.com');
    expect(formValues.invalid).toBe('invalidemail');
  });

  it('should validate email controls correctly', () => {
    const validControl = component.contactForm.get('valid');
    const invalidControl = component.contactForm.get('invalid');

    expect(validControl?.valid).toBe(true);
    expect(invalidControl?.valid).toBe(false);
    expect(invalidControl?.errors?.['email']).toBeTruthy();
  });

  it('should be invalid when an incorrect email is entered', () => {
    component.contactForm.patchValue({ valid: 'not-an-email' });
    expect(component.contactForm.get('valid')?.valid).toBe(false);
  });
});
