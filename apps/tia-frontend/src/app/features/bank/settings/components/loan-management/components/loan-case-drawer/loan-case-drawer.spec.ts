import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LoanCaseDrawer } from './loan-case-drawer';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PendingApproval, UserInfo, LoanDetailsResponse } from '../../shared/models/loan-management.model';

describe('LoanCaseDrawer', () => {
  let component: LoanCaseDrawer;
  let fixture: ComponentFixture<LoanCaseDrawer>;

  const mockLoanDetails: PendingApproval = {
    id: 'loan-123',
    userFullName: 'John Doe',
    userEmail: 'john@example.com',
    loanAmount: 50000,
    loanPurpose: 'home_improvement',
    loanTerm: 36,
    requestDate: '2024-01-15T10:00:00Z',
    status: 'pending',
  };

  const mockUserInfo: UserInfo = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    employmentStatus: 'employed',
    annualIncome: 75000,
    creditScore: 720,
    creditScoreBadge: 'Good',
  };

  const mockLoanDetailsResponse: LoanDetailsResponse = {
    loanDetails: {
      loanAmount: 50000,
      loanPurpose: 'home_improvement',
      loanTerm: 36,
      interestRate: 5.5,
      monthlyPayment: 1500,
      requestDate: '2024-01-15T10:00:00Z',
    },
    riskAssessment: {
      debtToIncomeRatio: 35,
      loanToIncomeRatio: 66.7,
      totalInterest: 4000,
    },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('computed properties', () => {
    it('should calculate canApprove correctly', async () => {
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      fixture.componentRef.setInput('isActionLoading', false);
      fixture.detectChanges();
      
      // Wait for effect to complete
      await fixture.whenStable();
      
      component.showDeclineForm.set(false);
      fixture.detectChanges();

      expect(component.canApprove()).toBe(true);

      component.showDeclineForm.set(true);
      fixture.detectChanges();
      expect(component.canApprove()).toBe(false);
    });

    it('should calculate canDecline correctly', async () => {
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      fixture.componentRef.setInput('isActionLoading', false);
      fixture.detectChanges();
      
      // Wait for effect to run
      await fixture.whenStable();
      
      component.showDeclineForm.set(true);
      component.declineReason.set('Risk too high');
      fixture.detectChanges();

      expect(component.canDecline()).toBe(true);

      component.declineReason.set('');
      fixture.detectChanges();
      expect(component.canDecline()).toBe(false);
    });

    it('should calculate creditScoreBadgeColor correctly', () => {
      const testCases = [
        { badge: 'Poor' as const, expectedColor: 'rose' as const },
        { badge: 'Fair' as const, expectedColor: 'amber' as const },
        { badge: 'Good' as const, expectedColor: 'teal' as const },
        { badge: 'Very Good' as const, expectedColor: 'cyan' as const },
        { badge: 'Excellent' as const, expectedColor: 'lime' as const },
      ];

      testCases.forEach(({ badge, expectedColor }) => {
        fixture.componentRef.setInput('userInfo', { ...mockUserInfo, creditScoreBadge: badge });
        fixture.detectChanges();
        expect(component.creditScoreBadgeColor()).toBe(expectedColor);
      });

      fixture.componentRef.setInput('userInfo', null);
      fixture.detectChanges();
      expect(component.creditScoreBadgeColor()).toBe('slate');
    });

    it('should calculate interestRate correctly', () => {
      fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
      fixture.detectChanges();
      expect(component.interestRate()).toBe(5.5);

      fixture.componentRef.setInput('loanDetailsResponse', null);
      fixture.detectChanges();
      expect(component.interestRate()).toBe(0);
    });

    it('should calculate monthlyPayment correctly', () => {
      fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
      fixture.detectChanges();
      expect(component.monthlyPayment()).toBe(1500);

      fixture.componentRef.setInput('loanDetailsResponse', null);
      fixture.detectChanges();
      expect(component.monthlyPayment()).toBe(0);
    });

    it('should calculate totalInterest correctly', () => {
      fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
      fixture.detectChanges();
      expect(component.totalInterest()).toBe(4000);
    });

    it('should calculate debtToIncomeRatio correctly', () => {
      fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
      fixture.detectChanges();
      expect(component.debtToIncomeRatio()).toBe(35);
    });

    it('should calculate loanToIncomeRatio correctly', () => {
      fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
      fixture.detectChanges();
      expect(component.loanToIncomeRatio()).toBe(66.7);
    });
  });

  describe('actions', () => {
    it('should emit closed event when onClose is called', () => {
      const closedSpy = vi.fn();
      component.closed.subscribe(closedSpy);

      component.showDeclineForm.set(true);
      component.declineReason.set('Some reason');
      component.onClose();

      expect(closedSpy).toHaveBeenCalled();
      expect(component.showDeclineForm()).toBe(false);
      expect(component.declineReason()).toBe('');
    });

    it('should emit approve event when onApprove is called with loan ID', () => {
      const approveSpy = vi.fn();
      component.approve.subscribe(approveSpy);
      
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      fixture.detectChanges();

      component.onApprove();

      expect(approveSpy).toHaveBeenCalledWith('loan-123');
    });

    it('should not emit approve event when no loan details', () => {
      const approveSpy = vi.fn();
      component.approve.subscribe(approveSpy);
      
      fixture.componentRef.setInput('loanDetails', null);
      fixture.detectChanges();

      component.onApprove();

      expect(approveSpy).not.toHaveBeenCalled();
    });

    it('should show decline form when onShowDeclineForm is called', () => {
      component.showDeclineForm.set(false);
      component.onShowDeclineForm();
      expect(component.showDeclineForm()).toBe(true);
    });

    it('should cancel decline form when onCancelDecline is called', () => {
      component.showDeclineForm.set(true);
      component.declineReason.set('Test reason');
      
      component.onCancelDecline();
      
      expect(component.showDeclineForm()).toBe(false);
      expect(component.declineReason()).toBe('');
    });

    it('should emit reject event when onConfirmDecline is called with valid data', () => {
      const rejectSpy = vi.fn();
      component.reject.subscribe(rejectSpy);
      
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      fixture.detectChanges();
      
      component.showDeclineForm.set(true);
      component.declineReason.set('Risk assessment failed');
      
      component.onConfirmDecline();

      expect(rejectSpy).toHaveBeenCalledWith({
        loanId: 'loan-123',
        reason: 'Risk assessment failed',
      });
    });

    it('should not emit reject event when reason is empty', () => {
      const rejectSpy = vi.fn();
      component.reject.subscribe(rejectSpy);
      
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      fixture.detectChanges();
      
      component.declineReason.set('   ');
      component.onConfirmDecline();

      expect(rejectSpy).not.toHaveBeenCalled();
    });

    it('should update decline reason when onReasonInput is called', () => {
      const mockEvent = {
        target: { value: 'New reason' }
      } as unknown as Event;
      
      component.onReasonInput(mockEvent);
      expect(component.declineReason()).toBe('New reason');
    });
  });

  describe('effect - state reset', () => {
    it('should reset decline form state when isOpen changes to false', async () => {
      fixture.componentRef.setInput('isOpen', true);
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

    it('should reset decline form state when loanDetails changes', async () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('loanDetails', mockLoanDetails);
      component.showDeclineForm.set(true);
      component.declineReason.set('Some reason');
      fixture.detectChanges();

      const newLoanDetails = { ...mockLoanDetails, id: 'loan-456' };
      fixture.componentRef.setInput('loanDetails', newLoanDetails);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.showDeclineForm()).toBe(false);
      expect(component.declineReason()).toBe('');
    });
  });
});
