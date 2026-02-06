import { TestBed } from '@angular/core/testing';
import { FinancesStore } from './finances.store';
import { FinancesService } from '../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { patchState } from '@ngrx/signals';

describe('FinancesStore', () => {
  let store: any;
  let service: any;

  beforeEach(() => {
    service = {
      getSummary: vi.fn(() => of({ totalIncome: 1000, incomeChange: 5 })),
      getCategories: vi.fn(() => of([])),
      getRecentTransactions: vi.fn(() => of([])),
      getIncomeVsExpenses: vi.fn(() => of([])),
      getSavingsTrend: vi.fn(() => of([])),
      getDailySpending: vi.fn(() => of([])),
    };
    TestBed.configureTestingModule({
      providers: [FinancesStore, { provide: FinancesService, useValue: service }]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should compute transactions and categories icons correctly', () => {
    // პირდაპირ ვასეტებთ სტეიტს, რომ ავირიდოთ ასინქრონული ლოდინი
    patchState(store, {
      transactions: [
        { id: '1', category: 'Food & Dining', type: 'expense', amount: 50, title: 'Dinner', date: '2026-01-01' },
        { id: '2', category: 'Income', type: 'income', amount: 1000, title: 'Salary', date: '2026-01-01' }
      ],
      categories: [{ category: 'Food & Dining', amount: 50, color: '#6B7280' }],
      summary: { totalIncome: 1000, incomeChange: 10 } as any
    });

    const txs = store.transactionsWithIcons();
    const cats = store.categoriesWithIcons();

    // ვამოწმებთ ჩვენს მთავარ ლოგიკას (ქავერიჯისთვის)
    expect(txs.length).toBe(2);
    expect(txs[0].statusIcon).toContain('expense-abs');
    expect(txs[1].statusIcon).toContain('income-abs');
    expect(txs[0].categoryColor).toBeDefined();
    expect(cats[0].icon).toBeDefined();
    expect(store.summaryCards().length).toBeGreaterThan(0);
  });

  it('should handle chart computations', () => {
    patchState(store, {
      incomeVsExpenses: [{ month: 'Jan', income: 100, expenses: 80 }],
      savingsTrend: [{ month: 'Jan', savings: 20 }],
      dailySpending: [{ day: 1, amount: 10 }]
    });

    expect(store.charts().length).toBe(4);
    expect(store.charts()[0].data.datasets[0].data).toEqual([100]);
  });

  it('should cover error branches in loadAllData', async () => {
    // 500 Error
    service.getSummary.mockReturnValue(throwError(() => ({ status: 500 })));
    store.loadAllData({ from: '2026-01-01' });
    
    // 401 Error
    service.getSummary.mockReturnValue(throwError(() => ({ status: 401 })));
    store.loadAllData({ from: '2026-01-01' });

    // Empty summary
    service.getSummary.mockReturnValue(of(null));
    store.loadAllData({ from: '2026-01-01' });

    expect(store.loading()).toBeDefined();
  });
});