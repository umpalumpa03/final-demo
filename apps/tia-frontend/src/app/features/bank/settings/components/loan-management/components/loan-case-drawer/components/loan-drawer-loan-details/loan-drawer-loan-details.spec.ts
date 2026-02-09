import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDrawerLoanDetails } from './loan-drawer-loan-details';
import { LoanDetailsResponse } from '../../../../shared/models/loan-management.model';

describe('LoanDrawerLoanDetails', () => {
  let component: LoanDrawerLoanDetails;
  let fixture: ComponentFixture<LoanDrawerLoanDetails>;

  const mockLabels = {
    loanSection: 'Loan Details',
    loanAmount: 'Loan Amount',
    loanPurpose: 'Loan Purpose',
    loanTerm: 'Loan Term',
    interestRate: 'Interest Rate',
    monthlyPayment: 'Monthly Payment',
    requestDate: 'Request Date',
    months: 'months',
  };

  const mockLoanDetailsResponse: LoanDetailsResponse = {
    loanDetails: {
      loanAmount: 50000,
      loanPurpose: 'home_improvement',
      loanTermMonths: 36,
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
      imports: [LoanDrawerLoanDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDrawerLoanDetails);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', mockLabels);
    fixture.detectChanges();
  });

  it('should create with default input values', () => {
    expect(component).toBeTruthy();
    expect(component.loanDetails()).toBeNull();
    expect(component.loanDetailsResponse()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('computed properties should return 0 when loanDetailsResponse is null and correct values when provided', () => {
    expect(component.interestRate()).toBe(0);
    expect(component.monthlyPayment()).toBe(0);

    fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
    fixture.detectChanges();
    expect(component.interestRate()).toBe(5.5);
    expect(component.monthlyPayment()).toBe(1500);

    fixture.componentRef.setInput('loanDetailsResponse', null);
    fixture.detectChanges();
    expect(component.interestRate()).toBe(0);
    expect(component.monthlyPayment()).toBe(0);
  });
});
