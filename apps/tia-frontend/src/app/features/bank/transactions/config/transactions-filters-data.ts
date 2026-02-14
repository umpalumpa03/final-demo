import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { FilterConfig } from '../models/transactions-filters.models';

export const getTransactionFiltersConfig = (
  categoryOptions: SelectOption[],
  accountOptions: SelectOption[],
  currencyOptions: SelectOption[],
): FilterConfig[] => {
  return [
    {
      controlName: 'searchCriteria',
      type: 'input',
      inputType: 'search',
      uiConfig: {
        label: 'transactions.filters.search',
        placeholder: 'transactions.filters.search',
      },
    },
    {
      controlName: 'category',
      type: 'select',
      options: categoryOptions,
      uiConfig: {
        label: 'transactions.filters.category',
        placeholder: 'transactions.filters.all_categories',
      },
    },
    {
      controlName: 'amountFrom',
      type: 'input',
      inputType: 'number',
      uiConfig: {
        label: 'transactions.filters.min_amount',
        placeholder: '0',
      },
    },
    {
      controlName: 'amountTo',
      type: 'input',
      inputType: 'number',
      uiConfig: {
        label: 'transactions.filters.max_amount',
        placeholder: 'transactions.filters.any',
      },
    },
    {
      controlName: 'accountIban',
      type: 'select',
      options: accountOptions,
      uiConfig: {
        label: 'transactions.filters.account',
        placeholder: 'transactions.filters.select_account',
      },
    },
    {
      controlName: 'currency',
      type: 'select',
      options: currencyOptions,
      uiConfig: {
        label: 'transactions.filters.currency',
        placeholder: 'transactions.filters.all',
      },
    },
    {
      controlName: 'dateFrom',
      type: 'input',
      inputType: 'date',
      uiConfig: {
        label: 'transactions.filters.date_from',
        max: new Date().toISOString().split('T')[0],
      },
    },
    {
      controlName: 'dateTo',
      type: 'input',
      inputType: 'date',
      uiConfig: {
        label: 'transactions.filters.date_to',
        max: new Date().toISOString().split('T')[0],
      },
    },
  ] as const;
};
