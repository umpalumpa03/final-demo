import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  PaginatedResponse,
  TransactionFilter,
  TransactionInterface,
} from '../../models/transactions.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://tia.up.railway.app/transactions';

  public getTransactions(
    filters: TransactionFilter,
  ): Observable<PaginatedResponse<TransactionInterface>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = this.createHttpParams(filters);
    return this.http.get<PaginatedResponse<TransactionInterface>>(this.apiUrl, {
      headers,
      params,
    });
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

    standardKeys.forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return params;
  }
}
