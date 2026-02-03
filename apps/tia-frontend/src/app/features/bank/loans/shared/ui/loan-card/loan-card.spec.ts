import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanCard } from './loan-card';
import { ILoan } from '../../models/loan.model';
import { describe, it, expect, beforeEach } from 'vitest';
import { LOAN_ICONS } from '../../config/loan-icons.config';

describe('LoanCard', () => {
  let component: LoanCard;
  let fixture: ComponentFixture<LoanCard>;

  const baseLoan: ILoan = {
    id: '1',
    loanAmount: 5000,
    accountId: '123',
    months: 24,
    purpose: 'Education',
    status: 1,
    statusName: 'Pending',
    monthlyPayment: 250,
    nextPaymentDate: null,
    createdAt: '2025-01-01',
    friendlyName: 'My Loan',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCard);
    component = fixture.componentInstance;

    updateInput(baseLoan);
  });

  function updateInput(
    loan: ILoan,
    variant: 'default' | 'colored' = 'default',
  ) {
    fixture.componentRef.setInput('loan', loan);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle Status 2 (Approved) - Colored', () => {
    updateInput({ ...baseLoan, status: 2 }, 'colored');

    const config = (component as any).config();

    expect(config.badgeClass).toBe('badge--approved');
    expect(config.iconSrc).toBe(LOAN_ICONS.approve);
    expect(config.iconClass).toBe('card__icon--green');
    expect((component as any).showPaymentDetails()).toBe(true);
  });

  it('should handle Default Case (Unknown Status) - Colored', () => {
    updateInput({ ...baseLoan, status: 99 }, 'colored');

    const config = (component as any).config();

    expect(config.badgeClass).toBe('badge--gray');
    expect(config.iconSrc).toBe(LOAN_ICONS.default);
    expect(config.iconClass).toBe('card__icon--blue');
  });

  // it('should enable edit mode and focus input', async () => {
  //   const event = { stopPropagation: vi.fn() } as any;

  //   (component as any).isEditing.set(false);
  //   (component as any).enableEdit(event);
  //   fixture.detectChanges();

  //   expect(event.stopPropagation).toHaveBeenCalled();
  //   expect((component as any).isEditing()).toBe(true);

  //   expect((component as any).nameControl.value).toBe('My Loan');

  //   await new Promise((resolve) => setTimeout(resolve, 0));
  // });

  it('should emit rename if name changed and valid', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    (component as any).nameControl.setValue('New Name');

    (component as any).onSave();

    expect(spy).toHaveBeenCalledWith({ id: '1', name: 'New Name' });
    expect((component as any).isEditing()).toBe(false);
  });
});
