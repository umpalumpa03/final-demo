import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan, LoanMonthsResponse } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';

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
}
