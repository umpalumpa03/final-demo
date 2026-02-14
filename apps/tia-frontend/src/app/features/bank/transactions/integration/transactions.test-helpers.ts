import { vi } from 'vitest';
import { signal } from '@angular/core';

export const createTransactionsMocks = () => {
  return {
    facade: {
      initializePage: vi.fn(),
      updateFilters: vi.fn(),
      loadMore: vi.fn(),
      retryLoad: vi.fn(),
      items: signal([] as any[]),
      categoryOptions: signal([]),
      categoryOptionsForModal: signal([]),
      isLoading: signal(false),
      transactionError: signal(null),
    },
    actions: {
      openCategorizeModal: vi.fn(),
      handleRepeatAction: vi.fn(),
      exportSingleTransaction: vi.fn(),
      exportTransactionsTable: vi.fn(),
      closeCategorizeModal: vi.fn(),
      saveCategory: vi.fn(),
      isCategorizeModalOpen: signal(false),
      selectedTransaction: signal(null),
      isFiltersOpen: signal(false),
    },
    vm: {
      accountOptions: signal([]),
      currencyOptions: signal([]),
      totalTransactionsString: signal('Showing 0 of 0'),
      isEmpty: signal(true),
      tableConfig: signal({ headers: [], rows: [] }),
    },
  };
};
