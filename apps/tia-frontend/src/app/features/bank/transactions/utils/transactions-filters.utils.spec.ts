import { describe, it, expect } from 'vitest';
import {
  mapFormIntoTransactionFilter,
  getActiveFilters,
} from './transactions-filters.utils';
import { FilterConfig } from '../models/transactions-filters.models';

describe('TransactionsFilters Utils', () => {
  describe('mapFormIntoTransactionFilter', () => {
    it('should map valid values and use defaults for empty ones', () => {
      const input = {
        searchCriteria: 'Test Search',
        amountFrom: 100,
        category: null,
      };

      const result = mapFormIntoTransactionFilter(input);

      expect(result).toEqual({
        searchCriteria: 'Test Search',
        category: undefined,
        amountFrom: 100,
        amountTo: undefined,
        iban: undefined,
        currency: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });
  });

  describe('getActiveFilters', () => {
    const mockConfig: FilterConfig[] = [
      {
        controlName: 'name',
        type: 'input',
        uiConfig: { label: 'Name' },
      },
      {
        controlName: 'status',
        type: 'select',
        uiConfig: { label: 'Status' },
        options: [
          { label: 'Active', value: '1' },
          { label: 'Inactive', value: '2' },
        ],
      },
    ];

    it('should return empty array if formValues is null', () => {
      expect(getActiveFilters(null, [])).toEqual([]);
    });

    it('should filter out empty/null values and format display text correctly', () => {
      const formValues = {
        name: 'John',
        status: '1',
        amount: null,
        date: '',
      };

      const result = getActiveFilters(formValues as any, mockConfig);
      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        key: 'name',
        displayText: 'Name: John',
      });

      expect(result[1]).toEqual({
        key: 'status',
        displayText: 'Status: Active',
      });
    });

    it('should fallback to value if select option is not found', () => {
      const formValues = { status: '99' };
      const result = getActiveFilters(formValues as any, mockConfig);
      expect(result[0].displayText).toBe('Status: 99');
    });
  });
});
