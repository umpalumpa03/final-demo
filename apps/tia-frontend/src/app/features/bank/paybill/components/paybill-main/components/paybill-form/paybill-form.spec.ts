import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillForm } from './paybill-form';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PaybillForm', () => {
  let component: PaybillForm;
  let fixture: ComponentFixture<PaybillForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillForm, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should patch amount when verifiedDetails becomes valid', async () => {
    const mockDetails = {
      valid: true,
      amountDue: 123.45,
      accountHolder: 'John',
    };

    fixture.componentRef.setInput('verifiedDetails', mockDetails);

    await fixture.whenStable();

    expect(component.paybillForm.controls.amount.value).toBe(123.45);
  });

  it('should emit verify output when form is submitted and not verified', () => {
    const spy = vi.spyOn(component.verify, 'emit');
    component.paybillForm.controls.accountNumber.setValue('123456');

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({ accountNumber: '123456' });
  });

  it('should emit pay output when form is submitted and is verified', () => {
    const spy = vi.spyOn(component.pay, 'emit');

    fixture.componentRef.setInput('verifiedDetails', {
      valid: true,
      amountDue: 10,
    });

    component.paybillForm.controls.accountNumber.setValue('123456');
    component.paybillForm.controls.amount.setValue(50);

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({ accountNumber: '123456', amount: 50 });
  });

  it('should mark fields as touched if invalid on submit', () => {
    component.paybillForm.controls.accountNumber.setValue('');
    component.onSubmit();
    expect(component.paybillForm.controls.accountNumber.touched).toBe(true);
  });

  it('should return early if isLoading is true', () => {
    const spy = vi.spyOn(component.verify, 'emit');
    fixture.componentRef.setInput('isLoading', true);
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });
});
