import { HttpParams } from '@angular/common/http';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';

export function createTransactionHttpParams(
  filters: ITransactionFilter,
): HttpParams {
  let params = new HttpParams();

  if (filters.pageCursor) {
    params = params.set('page[cursor]', filters.pageCursor);
  }

  if (filters.pageLimit) {
    params = params.set('page[limit]', filters.pageLimit.toString());
  }

  const standardKeys: (keyof ITransactionFilter)[] = [
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
