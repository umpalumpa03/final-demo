import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PaginatedResponse,
  TransactionFilter,
  ITransactions,
} from '../../models/transactions/transactions.models';
import { createTransactionHttpParams } from './utils/transactions-params';

@Injectable(
  {
    providedIn: 'root',
  }
)
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getTransactions(
    filters: TransactionFilter,
  ): Observable<PaginatedResponse<ITransactions>> {
    const params = createTransactionHttpParams(filters);

    return this.http.get<PaginatedResponse<ITransactions>>(
      `${this.apiUrl}/transactions`,
      { params },
    );
  }

  public getTransactionsTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/transactions/total`);
  }
}
