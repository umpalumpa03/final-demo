import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment';
import {
  ApproveLoanRequest,
  ApproveLoanResponse,
  LoanDetailsResponse,
  PendingApproval,
  UserInfo,
} from '../models/loan-management.model';

@Injectable({ providedIn: 'root' })
export class LoanManagementApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  public getPendingApprovals(): Observable<PendingApproval[]> {
    return this.http.get<PendingApproval[]>(`${this.apiUrl}/pending-approvals`);
  }

  public getLoanDetails(loanId: string): Observable<LoanDetailsResponse> {
    return this.http.get<LoanDetailsResponse>(`${this.apiUrl}/pending-approvals/${loanId}`);
  }

  public getUserInfo(userId: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user-info/${userId}`);
  }

  public approveLoan(body: ApproveLoanRequest): Observable<ApproveLoanResponse> {
    return this.http.post<ApproveLoanResponse>(`${this.apiUrl}/approve`, body);
  }
}
