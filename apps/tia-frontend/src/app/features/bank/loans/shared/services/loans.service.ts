import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan, LoanMonthsResponse } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';
import { LoanPurpose } from '../models/loan-request.model';
import { PrepaymentOption } from '../models/prepayment.model';

@Injectable()
export class LoansService {
  private readonly http = inject(HttpClient);
  private readonly loansApiUrl = `${environment.apiUrl}/loans`;

  public getAllLoans(status?: number): Observable<ILoan[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ILoan[]>(this.loansApiUrl, {
      params,
    });
  }

  public updateFriendlyName(
    loanId: string,
    friendlyName: string,
  ): Observable<ILoan> {
    return this.http.put<ILoan>(
      `${this.loansApiUrl}/update-friendly-name/${loanId}`,
      { friendlyName },
    );
  }

  public getLoanMonths(): Observable<LoanMonthsResponse> {
    return this.http.get<LoanMonthsResponse>(`${this.loansApiUrl}/loan-months`);
  }

  public getPurposes(): Observable<LoanPurpose[]> {
    return this.http.get<LoanPurpose[]>(`${this.loansApiUrl}/catalog/purposes`);
  }

  getPrepaymentOptions(): Observable<PrepaymentOption[]> {
    return this.http.get<PrepaymentOption[]>('/loans/loan-prepayment-options');
  }
}
