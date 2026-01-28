import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;
  
  const mockStore = {
    summary: signal({
      income: 5000,
      expenses: 2000,
      savings: 3000,
      efficiency: 60,
      incomeChange: 10,
      expensesChange: -5,
      savingsChange: 15,
      efficiencyChange: 2
    }),
    loading: signal(false),
    error: signal(null),
    loadSummary: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesContainer],
      providers: [{ provide: FinancesStore, useValue: mockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and load summary', () => {
    expect(mockStore.loadSummary).toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    const result = component['formatCurrency'](1250);
    expect(result).toContain('$1,250');
  });

  it('should update filter and re-fetch data', () => {
    component.onFilterChange('custom');
    expect(component.activeFilter).toBe('custom');
    expect(mockStore.loadSummary).toHaveBeenCalled();
  });

  it('should map store data to summaryCardsData correctly', () => {
    const cards = component.summaryCardsData();
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].value).toBeDefined();
    expect(['positive', 'negative']).toContain(cards[0].changeType);
  });

  it('should handle input and update form control', () => {
    const mockEvent = { target: { value: '2026-05-20' } } as any;
    component.handleInput('fromDate', mockEvent);
    expect(component.filterForm.get('fromDate')?.value).toBe('2026-05-20');
  });

  it('should trigger fetchData on valid form changes', async () => {
  // ვიყენებთ Vitest-ის ტაიმერებს
  vi.useFakeTimers();
  
  const spy = vi.spyOn(mockStore, 'loadSummary');
  
  // ფორმის შეცვლა
  component.filterForm.patchValue({ fromDate: '2026-02-01' });
  
  // debounceTime(500)-ის "გადახტომა"
  vi.advanceTimersByTime(500);
  
  expect(spy).toHaveBeenCalled();
  
  // ტაიმერების გასუფთავება
  vi.useRealTimers();
});
});