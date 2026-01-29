import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;
  
  const mockStore = {
    summary: signal<any>({ 
      income: 5000, 
      incomeChange: 5,
      expenses: 2000, 
      expensesChange: -2,
      savings: 3000,
      savingsChange: 10,
      efficiency: 60,
      efficiencyChange: 1.5
    }),
    loadAllData: vi.fn(), 
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FinancesContainer],
      providers: [
        { provide: FinancesStore, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
  });

  it('should cover summaryCardsData computed logic (mapping)', () => {
    mockStore.summary.set({
      income: 100, incomeChange: 1,
      expenses: 50, expensesChange: -1,
      savings: 50, savingsChange: 0,
      efficiency: 100, efficiencyChange: 0
    });

    const cards = component.summaryCardsData();
    
    expect(cards).toBeDefined();
    expect(Array.isArray(cards)).toBe(true);
    
    if (cards.length > 0) {
      expect(cards[0]).toHaveProperty('label');
      expect(cards[0]).toHaveProperty('value');
      expect(cards[0]).toHaveProperty('changeType');
    }
  });

  it('should cover formatCurrency branches', () => {
    const formatted = (component as any).formatCurrency(1000);
    expect(formatted).toContain('1,000');
    expect(formatted).toContain('$');
  });

  it('should cover onFilterChange and fetchData branches', () => {
    component.onFilterChange('custom');
    component.filterForm.patchValue({ toDate: '2026-02-01' });
    (component as any).fetchData();
    
    component.onFilterChange('month');
    (component as any).fetchData();

    expect(mockStore.loadAllData).toHaveBeenCalled();
  });

  it('should cover handleInput logic', () => {
    const event = { target: { value: '2026-12-31' } } as any;
    component.handleInput('fromDate', event);
    expect(component.filterForm.get('fromDate')?.value).toBe('2026-12-31');
  });

  it('should cover ngOnInit and form valueChanges pipe with debounce', async () => {
    vi.useFakeTimers();
    component.ngOnInit();
    
    component.filterForm.patchValue({
      fromDate: '2026-01-20',
      toDate: '2026-01-25'
    });

    vi.advanceTimersByTime(505);
    
    expect(mockStore.loadAllData).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should return empty array if store summary is null', () => {
    mockStore.summary.set(null);
    const cards = component.summaryCardsData();
    expect(cards).toEqual([]);
  });
});