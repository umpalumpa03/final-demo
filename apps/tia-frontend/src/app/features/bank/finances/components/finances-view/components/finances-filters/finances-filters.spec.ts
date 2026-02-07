import { TestBed } from '@angular/core/testing';
import { FinancesStore } from '../../../../store/finances.store';
import { FinancesService } from '../../../../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesStore', () => {
  let store: any;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      getSummary: vi.fn(),
      getCategories: vi.fn(),
      getDailySpending: vi.fn(),
      getIncomeVsExpenses: vi.fn(),
      getSavingsTrend: vi.fn(),
      getRecentTransactions: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FinancesStore,
        { provide: FinancesService, useValue: mockService }
      ],
    });

    store = TestBed.inject(FinancesStore);
  });

  it('should have initial state', () => {
    expect(store.loading()).toBe(false);
    expect(store.summary()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should update state on successful loadAllData', () => {
    const mockSummary = { totalBalance: 1000 };
    mockService.getSummary.mockReturnValue(of(mockSummary));
    mockService.getCategories.mockReturnValue(of([]));
    mockService.getDailySpending.mockReturnValue(of([]));
    mockService.getIncomeVsExpenses.mockReturnValue(of([]));
    mockService.getSavingsTrend.mockReturnValue(of([]));
    mockService.getRecentTransactions.mockReturnValue(of([]));

    store.loadAllData({ from: '2024-01-01' });

    expect(store.loading()).toBe(false);
    expect(store.summary()).toEqual(mockSummary);
    expect(store.error()).toBeNull();
  });

  it('should set error message when API fails', () => {
    mockService.getSummary.mockReturnValue(throwError(() => ({ status: 500 })));
    mockService.getCategories.mockReturnValue(of([]));
    mockService.getDailySpending.mockReturnValue(of([]));
    mockService.getIncomeVsExpenses.mockReturnValue(of([]));
    mockService.getSavingsTrend.mockReturnValue(of([]));
    mockService.getRecentTransactions.mockReturnValue(of([]));

    store.loadAllData({ from: '2024-01-01' });

    expect(store.loading()).toBe(false);
    expect(store.error()).toContain('Server is currently unavailable');
  });

  it('should calculate summaryCards correctly', () => {
    const mockData = { totalBalance: 5000, balanceChange: 10 };
    
    mockService.getSummary.mockReturnValue(of(mockData));
    mockService.getCategories.mockReturnValue(of([]));
    mockService.getDailySpending.mockReturnValue(of([]));
    mockService.getIncomeVsExpenses.mockReturnValue(of([]));
    mockService.getSavingsTrend.mockReturnValue(of([]));
    mockService.getRecentTransactions.mockReturnValue(of([]));

    store.loadAllData({ from: '2024-01-01' });

    const cards = store.summaryCards();
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].value).toContain('$'); 
  });
});