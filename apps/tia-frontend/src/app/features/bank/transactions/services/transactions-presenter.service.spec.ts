import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TransactionsPresenterService } from './transactions-presenter.service';

describe('TransactionsPresenterService', () => {
  let service: TransactionsPresenterService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [TransactionsPresenterService],
    });

    service = TestBed.inject(TransactionsPresenterService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const formValue = service.filterForm.value;
    expect(formValue.searchCriteria).toBe('');
    expect(formValue.amountFrom).toBeNull();
  });

  describe('Configuration Signals', () => {
    it('should update filtersConfig when options signals change', () => {
      service.categoryOptions.set([{ label: 'Food', value: 'cat_1' }]);
      service.currencyOptions.set([{ label: 'GEL', value: 'GEL' }]);

      const config = service.filtersConfig();
      const catConfig = config.find((c) => c.controlName === 'category');

      expect(catConfig?.options?.length).toBe(1);
    });
  });

  describe('Form Logic & Active Filters', () => {
    it('should compute active filters and hasActiveFilter', () => {
      service.filterForm.patchValue({ amountFrom: 500 });

      vi.advanceTimersByTime(400);

      const active = service.activeFilters();
      expect(active.length).toBeGreaterThan(0);
      expect(active[0].key).toBe('amountFrom');
      expect(active[0].value).toBe(500);

      expect(service.hasActiveFilter()).toBe(true);
    });
  });

  describe('Initial Filters Effect', () => {
    it('should patch form when initialFilters signal is set', () => {
      const initData: Partial<ITransactionFilter> = {
        searchCriteria: 'Initial',
        amountTo: 200,
      };

      service.initialFilters.set(initData);
      TestBed.flushEffects();

      expect(service.filterForm.value.searchCriteria).toBe('Initial');
      expect(service.filterForm.value.amountTo).toBe(200);
    });
  });

  describe('Public Methods', () => {
    it('should reset filters', () => {
      service.filterForm.patchValue({ searchCriteria: 'reset me' });
      service.resetFilters();
      expect(service.filterForm.value.searchCriteria).toBeNull();
    });

    it('should remove a specific filter', () => {
      service.filterForm.patchValue({ category: 'cat_1', amountFrom: 100 });

      service.removeFilter('category');

      expect(service.filterForm.value.category).toBeNull();
      expect(service.filterForm.value.amountFrom).toBe(100);
    });
  });
});
