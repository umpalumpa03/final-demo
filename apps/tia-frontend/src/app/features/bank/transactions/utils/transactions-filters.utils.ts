import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import {
  ActiveFilter,
  FilterConfig,
  FilterFormValues,
} from '../models/transactions-filters.models';
import { Params } from '@angular/router';

export function mapQueryParamsToFilter(
  params: Params,
): Partial<ITransactionFilter> {
  return {
    searchCriteria: params['searchCriteria'] || '',
    category: params['category'] || undefined,
    amountFrom: params['amountFrom'] ? Number(params['amountFrom']) : undefined,
    amountTo: params['amountTo'] ? Number(params['amountTo']) : undefined,
    iban: params['accountIban'] || undefined,
    currency: params['currency'] || undefined,
    dateFrom: params['dateFrom'] || undefined,
    dateTo: params['dateTo'] || undefined,
  };
}

export function mapFormIntoTransactionFilter(
  values: Partial<FilterFormValues>,
): ITransactionFilter {
  return {
    searchCriteria: values.searchCriteria?.trim() || '',
    category: values.category || undefined,
    amountFrom: values.amountFrom || undefined,
    amountTo: values.amountTo || undefined,
    iban: values.accountIban || undefined,
    currency: values.currency || undefined,
    dateFrom: values.dateFrom || undefined,
    dateTo: values.dateTo || undefined,
  };
}

export function getActiveFilters(
  formValues: Partial<FilterFormValues> | null,
  config: FilterConfig[],
): ActiveFilter[] {
  if (!formValues) return [];

  return Object.entries(formValues)
    .filter((entry): entry is [string, string | number] =>
      isValidValue(entry[1]),
    )
    .map(([key, value]) => {
      const field = config.find((c) => c.controlName === key);
      const label = field?.uiConfig.label || key;

      let displayValue: string | number = value;

      if (field?.type === 'select' && field.options) {
        const selectedOption = field.options.find((opt) => opt.value === value);
        if (selectedOption) {
          displayValue = selectedOption.label;
        }
      }

      return {
        key,
        label,
        value: displayValue,
      };
    });
}

function isValidValue(
  value: string | number | null | undefined,
): value is string | number {
  return value !== null && value !== '' && value !== undefined;
}
