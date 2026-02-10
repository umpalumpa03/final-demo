import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDrawerApplicant, ApplicantLabels } from './loan-drawer-applicant';
import { UserInfo } from '../../../../shared/models/loan-management.model';

describe('LoanDrawerApplicant', () => {
  let component: LoanDrawerApplicant;
  let fixture: ComponentFixture<LoanDrawerApplicant>;

  const mockLabels: ApplicantLabels = {
    applicantSection: 'Applicant Information',
    fullName: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    employmentStatus: 'Employment Status',
    address: 'Address',
    annualIncome: 'Annual Income',
    creditScore: 'Credit Score',
    applicantUnavailable: 'Applicant information unavailable',
    creditScorePoor: 'Poor',
    creditScoreFair: 'Fair',
    creditScoreGood: 'Good',
    creditScoreVeryGood: 'Very Good',
    creditScoreExcellent: 'Excellent',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDrawerApplicant],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDrawerApplicant);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', mockLabels);
    fixture.detectChanges();
  });

  it('creditScoreBadgeVariant should map credit score badges to variant strings and default to pending', () => {
    const cases: Array<[UserInfo['creditScoreBadge'], string]> = [
      ['Poor', 'poor'],
      ['Fair', 'fair'],
      ['Good', 'good'],
      ['Very Good', 'very-good'],
      ['Excellent', 'excellent'],
    ];

    cases.forEach(([badge, expected]) => {
      fixture.componentRef.setInput('userInfo', { ...mockUserInfo, creditScoreBadge: badge });
      fixture.detectChanges();
      expect(component.creditScoreBadgeVariant()).toBe(expected);
    });

    fixture.componentRef.setInput('userInfo', null);
    fixture.detectChanges();
    expect(component.creditScoreBadgeVariant()).toBe('pending');
  });

  it('creditScoreBadgeText should return translated label for each credit score badge and empty for null', () => {
    fixture.componentRef.setInput('userInfo', { ...mockUserInfo, creditScoreBadge: 'Good' });
    fixture.detectChanges();
    expect(component.creditScoreBadgeText()).toBe('Good');

    fixture.componentRef.setInput('userInfo', null);
    fixture.detectChanges();
    expect(component.creditScoreBadgeText()).toBe('');
  });
});
