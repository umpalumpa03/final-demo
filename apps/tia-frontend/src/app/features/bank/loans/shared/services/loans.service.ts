import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private http = inject(HttpClient);
  private apiUrl = 'https://tia.up.railway.app/loans';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    });
  }

  getAllLoans(status?: number): Observable<ILoan[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ILoan[]>(this.apiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }
}
