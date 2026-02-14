import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { LoanCaseDrawer } from '../components/loan-case-drawer/loan-case-drawer';
import {
  PendingApproval,
  LoanDetailsResponse,
  UserInfo,
} from '../shared/models/loan-management.model';
import {
  mockPendingApprovals,
  mockUserInfo,
  mockLoanDetailsResponse,
} from './loan-management.test-helpers';

describe('LoanCaseDrawer Component Integration', () => {
  let component: LoanCaseDrawer;
  let fixture: ComponentFixture<LoanCaseDrawer>;

  const mockApproval: PendingApproval = mockPendingApprovals[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCaseDrawer],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCaseDrawer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  it('should not render content when closed', () => {
    const overlay: HTMLElement | null =
      fixture.nativeElement.querySelector('.loan-drawer__overlay');
    expect(overlay).toBeNull();
  });

  it('should render content when opened', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const drawer: HTMLElement | null =
      fixture.nativeElement.querySelector('.loan-drawer');
    expect(drawer).toBeTruthy();
  });

  it('should emit closed event on overlay click', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    const overlay: HTMLElement =
      fixture.nativeElement.querySelector('.loan-drawer__overlay');
    overlay.click();

    expect(closedSpy).toHaveBeenCalledOnce();
  });

  it('should emit closed event on close button click', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    const closeBtn: HTMLElement =
      fixture.nativeElement.querySelector('.loan-drawer__close-btn');
    closeBtn.click();

    expect(closedSpy).toHaveBeenCalledOnce();
  });

  it('should compute canApprove correctly', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.componentRef.setInput('isActionLoading', false);
    fixture.detectChanges();

    expect(component.canApprove()).toBe(true);
  });

  it('should disable canApprove when action is loading', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.componentRef.setInput('isActionLoading', true);
    fixture.detectChanges();

    expect(component.canApprove()).toBe(false);
  });

  it('should emit approve event with loan id', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const approveSpy = vi.fn();
    component.approve.subscribe(approveSpy);

    component.onApprove();

    expect(approveSpy).toHaveBeenCalledWith(mockApproval.id);
  });

  it('should show decline form and compute canDecline', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    expect(component.showDeclineForm()).toBe(false);
    expect(component.canDecline()).toBe(false);

    component.onShowDeclineForm();
    expect(component.showDeclineForm()).toBe(true);
    expect(component.canApprove()).toBe(false);

    component.declineReason.set('Insufficient income');
    expect(component.canDecline()).toBe(true);
  });

  it('should emit reject event with loan id and reason', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const rejectSpy = vi.fn();
    component.reject.subscribe(rejectSpy);

    component.onShowDeclineForm();
    component.declineReason.set('Insufficient income');
    component.onConfirmDecline();

    expect(rejectSpy).toHaveBeenCalledWith({
      loanId: mockApproval.id,
      reason: 'Insufficient income',
    });
  });

  it('should cancel decline and reset state', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    component.onShowDeclineForm();
    component.declineReason.set('Some reason');

    component.onCancelDecline();

    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
  });

  it('should reset decline form on close', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    component.onShowDeclineForm();
    component.declineReason.set('Some reason');

    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component.onClose();

    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
    expect(closedSpy).toHaveBeenCalledOnce();
  });

  it('should handle reason input from textarea event', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('loanDetails', mockApproval);
    fixture.detectChanges();

    const mockEvent = {
      target: { value: 'New decline reason' },
    } as unknown as Event;

    component.onReasonInput(mockEvent);

    expect(component.declineReason()).toBe('New decline reason');
  });
});
