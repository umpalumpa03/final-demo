import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanManagementApiService } from './loan-management-api.service';
import { environment } from '../../../../../../../../environments/environment';
import {
  PendingApproval,
  LoanDetailsResponse,
  UserInfo,
  ApproveLoanRequest,
  ApproveLoanResponse,
} from '../models/loan-management.model';

describe('LoanManagementApiService', () => {
  let service: LoanManagementApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/loans`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanManagementApiService],
    });

    service = TestBed.inject(LoanManagementApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPendingApprovals', () => {
    it('should fetch pending approvals', async () => {
      const mockApprovals: PendingApproval[] = [
        {
          id: 'loan-1',
          userFullName: 'John Doe',
          userEmail: 'john@example.com',
          loanAmount: 50000,
          loanPurpose: 'home_improvement',
          loanTerm: 36,
          requestDate: '2024-01-15T10:00:00Z',
          status: 'pending',
        },
      ];

      const promise = new Promise<void>((resolve) => {
        service.getPendingApprovals().subscribe((approvals) => {
          expect(approvals).toEqual(mockApprovals);
          expect(approvals.length).toBe(1);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/pending-approvals`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApprovals);
      
      await promise;
    });
  });

  describe('getLoanDetails', () => {
    it('should fetch loan details by ID', async () => {
      const loanId = 'loan-123';
      const mockLoanDetails: LoanDetailsResponse = {
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

      const promise = new Promise<void>((resolve) => {
        service.getLoanDetails(loanId).subscribe((details) => {
          expect(details).toEqual(mockLoanDetails);
          expect(details.loanDetails.loanAmount).toBe(50000);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/pending-approvals/${loanId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLoanDetails);
      
      await promise;
    });
  });

  describe('getUserInfo', () => {
    it('should fetch user info by user ID', async () => {
      const userId = 'user-456';
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

      const promise = new Promise<void>((resolve) => {
        service.getUserInfo(userId).subscribe((userInfo) => {
          expect(userInfo).toEqual(mockUserInfo);
          expect(userInfo.fullName).toBe('John Doe');
          expect(userInfo.creditScore).toBe(720);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/user-info/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserInfo);
      
      await promise;
    });
  });

  describe('approveLoan', () => {
    it('should approve a loan', async () => {
      const approveRequest: ApproveLoanRequest = {
        loanId: 'loan-789',
      };
      const mockResponse: ApproveLoanResponse = {
        success: true,
        message: 'Loan approved successfully',
      };

      const promise = new Promise<void>((resolve) => {
        service.approveLoan(approveRequest).subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(response.success).toBe(true);
          resolve();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/approve`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(approveRequest);
      req.flush(mockResponse);
      
      await promise;
    });
  });
});
