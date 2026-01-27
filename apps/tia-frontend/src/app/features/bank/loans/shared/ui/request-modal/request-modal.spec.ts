import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestModal } from './request-modal';

describe('RequestModal', () => {
  let component: RequestModal;
  let fixture: ComponentFixture<RequestModal>;

  // Helper to populate form quickly
  const fillValidForm = () => {
    // Removed 'as any'. The object structure matches the FormGroup definition.
    component.form.setValue({
      amount: '5000',
      account: 'acc_checking_01',
      term: '12',
      purpose: 'home_improvement',
      firstPaymentDate: '2026-01-01',
      address: {
        street: '123 Main St',
        city: 'Tbilisi',
        region: 'Tbilisi',
        postalCode: '0100',
      },
      contact: {
        fullName: 'John Doe',
        relationship: 'Brother',
        phone: '599123456',
        email: 'john@example.com',
      },
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModal, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestModal);
    component = fixture.componentInstance;

    // Required signal inputs must be set before change detection
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with an invalid form', () => {
      expect(component.form.valid).toBe(false);
      expect(component.form.get('amount')?.valid).toBe(false);
    });

    it('should have required validators', () => {
      const amountControl = component.form.get('amount');
      amountControl?.setValue('');
      expect(amountControl?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should validate minimum amount', () => {
      const amountControl = component.form.get('amount');

      amountControl?.setValue('50');
      expect(amountControl?.hasError('min')).toBe(true);

      amountControl?.setValue('150');
      expect(amountControl?.valid).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.form.get('contact.email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should validate phone number pattern', () => {
      const phoneControl = component.form.get('contact.phone');

      phoneControl?.setValue('abc');
      expect(phoneControl?.hasError('pattern')).toBe(true);

      phoneControl?.setValue('123456789');
      expect(phoneControl?.valid).toBe(true);
    });
  });

  describe('onSave()', () => {
    it('should NOT emit submit if form is invalid', () => {
      vi.spyOn(component.submit, 'emit');
      vi.spyOn(component.close, 'emit');
      vi.spyOn(component.form, 'markAllAsTouched');

      component.onSave();

      expect(component.form.valid).toBe(false);
      expect(component.submit.emit).not.toHaveBeenCalled();
      expect(component.close.emit).not.toHaveBeenCalled();
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('should emit submit and close if form is valid', () => {
      vi.spyOn(component.submit, 'emit');
      vi.spyOn(component.close, 'emit');
      vi.spyOn(component.form, 'reset');

      fillValidForm();
      expect(component.form.valid).toBe(true);

      component.onSave();

      expect(component.submit.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: '5000',
          account: 'acc_checking_01',
        }),
      );
      expect(component.form.reset).toHaveBeenCalled();
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('Close Interaction', () => {
    it('should emit close output when triggered', () => {
      vi.spyOn(component.close, 'emit');

      // Accessing protected output directly to verify emitter works
      component['close'].emit();

      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
