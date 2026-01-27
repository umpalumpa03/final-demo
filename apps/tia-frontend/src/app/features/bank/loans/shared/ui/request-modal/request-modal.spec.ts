import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestModal } from './request-modal';

describe('RequestModal', () => {
  let component: RequestModal;
  let fixture: ComponentFixture<RequestModal>;

  const fillValidForm = () => {
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
  });

  describe('onSave()', () => {
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
});
