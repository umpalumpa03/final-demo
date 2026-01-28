import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestModal } from './request-modal';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';

describe('RequestModal', () => {
  let component: RequestModal;
  let fixture: ComponentFixture<RequestModal>;
  let store: Store;

  const fillValidForm = () => {
    component.form.setValue({
      loanAmount: 5000,
      amountToReceiveAccountId: 'acc_checking_01',
      months: 12,
      purpose: 'home_improvement',
      firstPaymentDate: '2026-01-01',
      contact: {
        address: {
          street: '123 Main St',
          city: 'Tbilisi',
          region: 'Tbilisi',
          postalCode: '0100',
        },
        contactPerson: {
          name: 'John Doe',
          relationship: 'Brother',
          phone: '599123456',
          email: 'john@example.com',
        },
      },
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModal, ReactiveFormsModule],
      providers: provideMockStore({
        initialState: {
          loans_local: { months: [] },
          accounts: { accounts: [] },
        },
      }),
    }).compileComponents();

    store = TestBed.inject(Store);
    vi.spyOn(store, 'dispatch');

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
      expect(component.form.get('loanAmount')?.valid).toBe(false);
    });

    it('should have required validators', () => {
      const amountControl = component.form.get('loanAmount');
      amountControl?.setValue(null);
      expect(amountControl?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should validate minimum amount', () => {
      const amountControl = component.form.get('loanAmount');

      amountControl?.setValue(50);
      expect(amountControl?.hasError('min')).toBe(true);

      amountControl?.setValue(150);
      expect(amountControl?.valid).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.form.get('contact.contactPerson.email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });
  });

  describe('onSave()', () => {
    it('should dispatch requestLoan action and close modal when form is valid', () => {
      fillValidForm();
      vi.spyOn(component.close, 'emit');
      component.onSave();

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: LoansCreateActions.requestLoan.type,
          request: expect.objectContaining({
            loanAmount: 5000,
            amountToReceiveAccountId: 'acc_checking_01',
            months: 12,
          }),
        }),
      );

      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
