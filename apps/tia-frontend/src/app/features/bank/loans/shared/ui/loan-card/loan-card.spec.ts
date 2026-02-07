import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanCard } from './loan-card';
import { ILoan } from '../../models/loan.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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

  it('should handle Default Variant config', () => {
    updateInput(baseLoan, 'default');
    const config = (component as any).config();

    expect(config.iconClass).toBe('card__icon--blue');
    expect(config.iconSrc).toBe(LOAN_ICONS.default);
  });

  it('should enable edit mode and focus', () => {
    vi.useFakeTimers();
    const mockEvent = { stopPropagation: vi.fn() } as any;

    (component as any).enableEdit(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect((component as any).isEditing()).toBe(true);
    expect((component as any).nameControl.value).toBe(baseLoan.friendlyName);

    vi.advanceTimersByTime(1);
  });

  it('should not save if not in editing mode', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    (component as any).isEditing.set(false);

    (component as any).onSave();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not save if name is invalid', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    (component as any).isEditing.set(true);
    (component as any).nameControl.setValue('');

    (component as any).onSave();

    expect(spy).not.toHaveBeenCalled();
    expect((component as any).isEditing()).toBe(true);
  });

  it('should close edit mode but NOT emit if name is unchanged', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    (component as any).isEditing.set(true);
    (component as any).nameControl.setValue(baseLoan.friendlyName);

    (component as any).onSave();

    expect(spy).not.toHaveBeenCalled();
    expect((component as any).isEditing()).toBe(false);
  });
});
