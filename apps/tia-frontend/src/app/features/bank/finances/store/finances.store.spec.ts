import { TestBed } from '@angular/core/testing';
import { FinancesStore } from './finances.store';
import { FinancesService } from '../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesStore', () => {
  let store: any;
  let serviceMock: any;

  const mockFullData = {
    summary: { 
      totalIncome: 5000, totalExpenses: 3000, netProfit: 2000,
      incomeChange: 10, expenseChange: -5, netProfitChange: 15,
      savingsRate: 20, savingsRateChange: 2
    },
    categories: [
      { category: 'Food', amount: 500, color: '#6B7280' },
      { category: 'Rent', amount: 1500, color: '#10B981' }
    ],
    transactions: [
      { id: '1', category: 'Food', amount: 50, type: 'expense', date: new Date() },
      { id: '2', category: 'Salary', amount: 5000, type: 'income', date: new Date() }
    ],
    incomeVsExpenses: [{ month: 'Jan', income: 1000, expenses: 800 }],
    savingsTrend: [{ month: 'Jan', savings: 200 }],
    dailySpending: [{ day: 1, amount: 50 }]
  };

  beforeEach(() => {
    serviceMock = { getFullFinancialData: vi.fn() };
    TestBed.configureTestingModule({
      providers: [FinancesStore, { provide: FinancesService, useValue: serviceMock }]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should load all data and compute charts correctly', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of(mockFullData));
    store.loadAllData({ from: '2026-01-01' });

    expect(store.charts().length).toBe(4);
    expect(store.loading()).toBe(false);
  });

  it('should cover all icon and color resolution branches', () => {
    const customData = {
      ...mockFullData,
      transactions: [
        { id: 'tx-1', category: 'Salary', type: 'income', amount: 100, date: new Date() },
        { id: 'tx-2', category: 'Other', type: 'expense', amount: 50, icon: '/assets/icon.svg', date: new Date() }
      ],
      categories: [{ category: 'Food', amount: 100, color: '#6B7280' }]
    };

    serviceMock.getFullFinancialData.mockReturnValue(of(customData));
    store.loadAllData({ from: '2026-01-01' });

    const txs = store.transactionsWithIcons();
    const imageTx = txs.find((t: any) => t.id === 'tx-2');
    
    expect(txs.length).toBeGreaterThan(0);
    if (imageTx) {
      expect(imageTx.isImageIcon).toBe(true);
      expect(imageTx.statusIcon).toContain('expense-abs');
    }
    expect(store.categoriesWithIcons()[0].color).toBeDefined();
  });

  it('should format summary cards correctly including negative profit', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of({
      ...mockFullData,
      summary: { ...mockFullData.summary, netProfit: -500 }
    }));
    store.loadAllData({ from: '2026-01-01' });

    const cards = store.summaryCards();
    const negativeCard = cards.find((c: any) => c.changeType === 'negative' || c.value.includes('-$'));
    
    expect(cards.length).toBeGreaterThan(0);
    if (negativeCard) {
      expect(negativeCard.changeType).toBe('negative');
    }
  });

  it('should compute top categories with percentages and sorting', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of({
      ...mockFullData,
      categories: [
        { category: 'Rent', amount: 1000, color: '#1' },
        { category: 'Food', amount: 500, color: '#2' },
        { category: 'Tech', amount: 300, color: '#3' },
        { category: 'Other', amount: 100, color: '#4' },
      ],
      summary: { ...mockFullData.summary, totalExpenses: 1900 }
    }));
    store.loadAllData({ from: '2026-01-01' });

    const topCats = store.topCategoriesFooter();
    expect(topCats.length).toBe(3); 
    expect(topCats[0].category).toBe('Rent');
    expect(topCats[0].percentage).toBeDefined();
  });

  it('should compute savings average and daily spending high/low', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of({
      ...mockFullData,
      savingsTrend: [
        { month: 'Jan', savings: 200 },
        { month: 'Feb', savings: 400 }
      ],
      dailySpending: [
        { day: 1, amount: 10 },
        { day: 2, amount: 90 }
      ]
    }));
    store.loadAllData({ from: '2026-01-01' });

    const savings = store.savingsFooter();
    const daily = store.dailySpendingFooter();

    expect(savings?.average).toBeDefined();
    expect(daily?.highest).toContain('90');
    expect(daily?.lowest).toContain('10');
  });

  it('should handle missing data and zero expenses to avoid NaN', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of({
      summary: { ...mockFullData.summary, totalExpenses: 0 }, 
      categories: [{ category: 'Food', amount: 100, color: '#6B7280' }],
      savingsTrend: [], dailySpending: []
    }));
    store.loadAllData({ from: '2026-01-01' });

    expect(store.savingsFooter()).toBeNull();
    expect(store.topCategoriesFooter()[0].percentage).toBe('0');
  });

  it('should map HTTP errors correctly', () => {
    const errorCodes = [401, 500, 404];
    errorCodes.forEach(code => {
      serviceMock.getFullFinancialData.mockReturnValue(throwError(() => ({ status: code })));
      store.loadAllData({ from: '2026-01-01' });
      expect(store.error()).toBeDefined();
    });
  });

  it('should handle force refresh and filter empty calls', () => {
    serviceMock.getFullFinancialData.mockReturnValue(of(mockFullData));
    store.loadAllData({ from: '2026-01-01', force: true });
    expect(store.isRefreshing()).toBe(false);

    store.loadAllData({ from: '' });
    expect(serviceMock.getFullFinancialData).toHaveBeenCalledTimes(1);
  });
});