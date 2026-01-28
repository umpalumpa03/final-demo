import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ILoanRequest } from '../../../features/bank/loans/shared/models/loan-request.model';
import { ILoan } from '../../../features/bank/loans/shared/models/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanCreateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/loans`;

  public requestLoan(payload: ILoanRequest): Observable<ILoan> {
    return this.http.post<ILoan>(`${this.apiUrl}/request`, payload);
  }
}
