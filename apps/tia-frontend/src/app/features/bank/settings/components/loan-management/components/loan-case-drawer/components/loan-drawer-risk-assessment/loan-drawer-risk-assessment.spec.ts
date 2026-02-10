import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDrawerRiskAssessment } from './loan-drawer-risk-assessment';
import { LoanDetailsResponse } from '../../../../shared/models/loan-management.model';

describe('LoanDrawerRiskAssessment', () => {
  let component: LoanDrawerRiskAssessment;
  let fixture: ComponentFixture<LoanDrawerRiskAssessment>;

  const mockLabels = {
    riskSection: 'Risk Assessment',
    debtToIncome: 'Debt-to-Income Ratio',
    loanToIncome: 'Loan-to-Income Ratio',
    totalInterest: 'Total Interest',
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
      imports: [LoanDrawerRiskAssessment],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDrawerRiskAssessment);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', mockLabels);
    fixture.detectChanges();
  });

  it('computed properties should return correct values when loanDetailsResponse is provided', () => {
    fixture.componentRef.setInput('loanDetailsResponse', mockLoanDetailsResponse);
    fixture.detectChanges();
    expect(component.totalInterest()).toBe(4000);
    expect(component.debtToIncomeRatio()).toBe(35);
    expect(component.loanToIncomeRatio()).toBe(66.7);
  });
});
