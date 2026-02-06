import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityComponent } from './security.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
import { vi } from 'vitest';


const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const form = control as FormGroup;
  const newPassword = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return newPassword !== confirmPassword ? { passwordMismatch: true } : null;
};

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  const fb = new FormBuilder();

  const createForm = () =>
    fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }, 
    );

  const mockCurrentPasswordConfig: InputConfig = {
    label: 'Current Password',
    placeholder: 'Enter current password',
    required: true,
  };

  const mockNewPasswordConfig: InputConfig = {
    label: 'New Password',
    placeholder: 'Enter new password',
    required: true,
  };

  const mockConfirmPasswordConfig: InputConfig = {
    label: 'Confirm Password',
    placeholder: 'Confirm new password',
    required: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityComponent, TranslateModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('form', createForm());
    fixture.componentRef.setInput('currentPasswordConfig', mockCurrentPasswordConfig);
    fixture.componentRef.setInput('newPasswordConfig', mockNewPasswordConfig);
    fixture.componentRef.setInput('confirmPasswordConfig', mockConfirmPasswordConfig);

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should emit changePassword event when form is valid', () => {
    const emitSpy = vi.spyOn(component.changePassword, 'emit');

    component.form().setValue({
      currentPassword: 'currentPass123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      currentPassword: 'currentPass123',
      newPassword: 'newPassword123',
    });
  });
});
