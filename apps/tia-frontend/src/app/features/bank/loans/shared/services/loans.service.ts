import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class LoansService {
  private http = inject(HttpClient);
  private readonly loansApiUrl = `${environment.apiUrl}/loans`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    });
  }

  public getAllLoans(status?: number): Observable<ILoan[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ILoan[]>(this.loansApiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }

  public updateFriendlyName(
    loanId: string,
    friendlyName: string,
  ): Observable<any> {
    return this.http.put(
      `${this.loansApiUrl}/update-friendly-name/${loanId}`,
      { friendlyName },
      { headers: this.getHeaders() },
    );
  }
}
