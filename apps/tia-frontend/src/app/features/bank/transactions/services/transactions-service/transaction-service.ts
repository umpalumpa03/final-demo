import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PaginatedResponse,
  TransactionFilter,
  ITransactions,
} from '../../models/transactions.models';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getTransactions(
    filters: TransactionFilter,
  ): Observable<PaginatedResponse<ITransactions>> {
    const params = this.createHttpParams(filters);
    return this.http.get<PaginatedResponse<ITransactions>>(
      `${this.apiUrl}/transactions`,
      {
        params,
      },
    );
  }

  public getTransactionsTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/transactions/total`);
  }

  private createHttpParams(filters: TransactionFilter): HttpParams {
    let params = new HttpParams();

    if (filters.pageCursor) {
      params = params.set('page[cursor]', filters.pageCursor);
    }

    if (filters.pageLimit) {
      params = params.set('page[limit]', filters.pageLimit.toString());
    }

    const standardKeys: (keyof TransactionFilter)[] = [
      'searchCriteria',
      'amountFrom',
      'amountTo',
      'iban',
      'accountIban',
      'currency',
      'category',
      'dateFrom',
      'dateTo',
    ];

    for (const key of standardKeys) {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    }

    return params;
  }
}
