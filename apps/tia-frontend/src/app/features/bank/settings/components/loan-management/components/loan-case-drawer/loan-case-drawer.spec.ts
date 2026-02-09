import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LoanCaseDrawer } from './loan-case-drawer';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PendingApproval } from '../../shared/models/loan-management.model';

describe('LoanCaseDrawer', () => {
  let component: LoanCaseDrawer;
  let fixture: ComponentFixture<LoanCaseDrawer>;

  const mockLoanDetails: PendingApproval = {
    id: 'loan-123',
    userId: 'user-1',
    userFullName: 'John Doe',
    loanAmount: 50000,
    accountId: 'acc-1',
    months: 36,
    purpose: 'home_improvement',
    status: 1,
    statusName: 'pending',
    address: { street: '123 Main St', city: 'Test', region: 'Test', postalCode: '12345' },
    contactPerson: { name: 'Jane', relationship: 'spouse', phone: '555-0100', email: 'jane@test.com' },
    createdAt: '2024-01-15T10:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCaseDrawer, TranslateModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCaseDrawer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create with correct default state', () => {
    expect(component).toBeTruthy();
    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
    expect(component.loanDetails()).toBeNull();
    expect(component.isActionLoading()).toBe(false);
  });

  it('canApprove should be true when loanDetails exist, not loading, and decline form hidden', async () => {
    fixture.componentRef.setInput('loanDetails', mockLoanDetails);
    fixture.componentRef.setInput('isActionLoading', false);
    fixture.detectChanges();
    await fixture.whenStable();

    component.showDeclineForm.set(false);
    fixture.detectChanges();
    expect(component.canApprove()).toBe(true);

    component.showDeclineForm.set(true);
    fixture.detectChanges();
    expect(component.canApprove()).toBe(false);

    component.showDeclineForm.set(false);
    fixture.componentRef.setInput('isActionLoading', true);
    fixture.detectChanges();
    expect(component.canApprove()).toBe(false);

    fixture.componentRef.setInput('loanDetails', null);
    fixture.componentRef.setInput('isActionLoading', false);
    fixture.detectChanges();
    expect(component.canApprove()).toBe(false);
  });

  it('canDecline should be true when loanDetails exist, decline form shown, and reason provided', async () => {
    fixture.componentRef.setInput('loanDetails', mockLoanDetails);
    fixture.componentRef.setInput('isActionLoading', false);
    fixture.detectChanges();
    await fixture.whenStable();

    component.showDeclineForm.set(true);
    component.declineReason.set('Risk too high');
    fixture.detectChanges();
    expect(component.canDecline()).toBe(true);

    component.declineReason.set('');
    fixture.detectChanges();
    expect(component.canDecline()).toBe(false);

    component.declineReason.set('   ');
    fixture.detectChanges();
    expect(component.canDecline()).toBe(false);

    component.declineReason.set('Valid reason');
    fixture.componentRef.setInput('isActionLoading', true);
    fixture.detectChanges();
    expect(component.canDecline()).toBe(false);
  });

  it('onClose should reset state and emit closed event', () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);

    component.showDeclineForm.set(true);
    component.declineReason.set('Some reason');
    component.onClose();

    expect(spy).toHaveBeenCalled();
    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
  });

  it('onApprove should emit approve with loanId when details exist, or skip when null', () => {
    const spy = vi.fn();
    component.approve.subscribe(spy);

    fixture.componentRef.setInput('loanDetails', null);
    fixture.detectChanges();
    component.onApprove();
    expect(spy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('loanDetails', mockLoanDetails);
    fixture.detectChanges();
    component.onApprove();
    expect(spy).toHaveBeenCalledWith('loan-123');
  });

  it('onShowDeclineForm should set showDeclineForm to true', () => {
    component.showDeclineForm.set(false);
    component.onShowDeclineForm();
    expect(component.showDeclineForm()).toBe(true);
  });

  it('onCancelDecline should reset decline form and reason', () => {
    component.showDeclineForm.set(true);
    component.declineReason.set('Test reason');
    component.onCancelDecline();
    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
  });

  it('onConfirmDecline should emit reject with loanId and trimmed reason, skip on empty reason or null details', () => {
    const spy = vi.fn();
    component.reject.subscribe(spy);

    fixture.componentRef.setInput('loanDetails', null);
    fixture.detectChanges();
    component.declineReason.set('Some reason');
    component.onConfirmDecline();
    expect(spy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('loanDetails', mockLoanDetails);
    fixture.detectChanges();

    component.declineReason.set('   ');
    component.onConfirmDecline();
    expect(spy).not.toHaveBeenCalled();

    component.declineReason.set('Risk assessment failed');
    component.onConfirmDecline();
    expect(spy).toHaveBeenCalledWith({ loanId: 'loan-123', reason: 'Risk assessment failed' });
  });

  it('onReasonInput should update declineReason from event target value', () => {
    const mockEvent = { target: { value: 'New reason' } } as unknown as Event;
    component.onReasonInput(mockEvent);
    expect(component.declineReason()).toBe('New reason');
  });

  it('effect should reset decline form state when isOpen or loanDetails changes', async () => {
    fixture.componentRef.setInput('loanDetails', mockLoanDetails);
    component.showDeclineForm.set(true);
    component.declineReason.set('Some reason');
    fixture.detectChanges();

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
  });
});
