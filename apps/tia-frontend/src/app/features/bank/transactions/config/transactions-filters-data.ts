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
      uiConfig: { label: 'Search' },
    },
    {
      controlName: 'category',
      type: 'select',
      options: categoryOptions,
      uiConfig: { label: 'Category', placeholder: 'All Categories' },
    },
    {
      controlName: 'amountFrom',
      type: 'input',
      inputType: 'number',
      uiConfig: { label: 'Min Amount', placeholder: '0' },
    },
    {
      controlName: 'amountTo',
      type: 'input',
      inputType: 'number',
      uiConfig: { label: 'Max Amount', placeholder: 'Any' },
    },
    {
      controlName: 'accountIban',
      type: 'select',
      options: accountOptions,
      uiConfig: { label: 'Account', placeholder: 'Select Account' },
    },
    {
      controlName: 'currency',
      type: 'select',
      options: currencyOptions,
      uiConfig: { label: 'Currency', placeholder: 'All' },
    },
    {
      controlName: 'dateFrom',
      type: 'input',
      inputType: 'date',
      uiConfig: { label: 'Date From', placeholder: 'YYYY-MM-DD' },
    },
    {
      controlName: 'dateTo',
      type: 'input',
      inputType: 'date',
      uiConfig: { label: 'Date To', placeholder: 'YYYY-MM-DD' },
    },
  ] as const
};
