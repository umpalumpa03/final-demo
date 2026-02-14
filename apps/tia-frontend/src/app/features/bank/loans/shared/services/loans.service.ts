import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan, ILoanDetails, LoanMonthsResponse } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';
import { ILoanRequest, LoanPurpose } from '../models/loan-request.model';
import {
  IFullPrepaymentResponse,
  IInitiatePrepaymentRequest,
  IInitiatePrepaymentResponse,
  IPrepaymentCalcResponse,
  IVerifyPrepaymentRequest,
  IVerifyPrepaymentResponse,
  PrepaymentOption,
} from '../models/prepayment.model';

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

  public getLoanById(id: string): Observable<ILoanDetails> {
    return this.http.get<ILoanDetails>(`${this.loansApiUrl}/${id}`);
  }

  public requestLoan(payload: ILoanRequest): Observable<ILoan> {
    return this.http.post<ILoan>(`${this.loansApiUrl}/request`, payload);
  }

  public getLoanMonths(): Observable<LoanMonthsResponse> {
    return this.http.get<LoanMonthsResponse>(`${this.loansApiUrl}/loan-months`);
  }

  public getPurposes(): Observable<LoanPurpose[]> {
    return this.http.get<LoanPurpose[]>(`${this.loansApiUrl}/catalog/purposes`);
  }

  public getPrepaymentOptions(): Observable<PrepaymentOption[]> {
    return this.http.get<PrepaymentOption[]>(
      `${this.loansApiUrl}/loan-prepayment-options`,
    );
  }

  public calculatePartialPrepayment(
    loanId: string,
    amount: number,
    option: string,
  ): Observable<IPrepaymentCalcResponse> {
    const params = new HttpParams()
      .set('loanId', loanId)
      .set('amount', amount.toString())
      .set('option', option);

    return this.http.get<IPrepaymentCalcResponse>(
      `${this.loansApiUrl}/calculate-partial-prepayment`,
      { params },
    );
  }

  public calculateFullPrepayment(
    loanId: string,
  ): Observable<IFullPrepaymentResponse> {
    return this.http.get<IFullPrepaymentResponse>(
      `${this.loansApiUrl}/calculate-full-prepayment/{loanId}?loanId=${loanId}`,
    );
  }

  public initiatePrepayment(
    payload: IInitiatePrepaymentRequest,
  ): Observable<IInitiatePrepaymentResponse> {
    return this.http.post<IInitiatePrepaymentResponse>(
      `${this.loansApiUrl}/loan-prepayment`,
      payload,
    );
  }

  public verifyPrepayment(
    payload: IVerifyPrepaymentRequest,
  ): Observable<IVerifyPrepaymentResponse> {
    return this.http.post<IVerifyPrepaymentResponse>(
      `${this.loansApiUrl}/verify-prepayment`,
      payload,
    );
  }
}
