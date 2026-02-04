import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import {
  ApproveLoanRequest,
  ApproveLoanResponse,
  PendingApproval,
  UserInfo,
} from '../models/loan-management.model';

/**
 * Thin API service for loan management (support/admin).
 * Contains only HTTP calls - no state management.
 * Auth token injection handled by authInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class LoanManagementApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  /**
   * GET /loans/pending-approvals
   * Returns list of loans awaiting approval with full details.
   */
  getPendingApprovals(): Observable<PendingApproval[]> {
    return this.http.get<PendingApproval[]>(`${this.apiUrl}/pending-approvals`);
  }

  /**
   * GET /loans/user-info/{userId}
   * Returns user details for the loan applicant.
   * Called ONLY on demand when loan case drawer is opened.
   * NEVER call this per row in the list.
   */
  getUserInfo(userId: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user-info/${userId}`);
  }

  /**
   * POST /loans/approve
   * Approves or rejects a pending loan.
   * @param body - Contains loanId, status (1=approved, 2=rejected), and optional rejectionReason
   */
  approveLoan(body: ApproveLoanRequest): Observable<ApproveLoanResponse> {
    return this.http.post<ApproveLoanResponse>(`${this.apiUrl}/approve`, body);
  }
}
