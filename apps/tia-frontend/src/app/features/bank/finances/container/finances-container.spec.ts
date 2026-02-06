import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;

  const storeMock = {
    loadAllData: vi.fn(),
    loading: vi.fn(() => false),
    error: vi.fn(() => null),
    summaryCards: vi.fn(() => []),
    charts: vi.fn(() => []),
    categoriesWithIcons: vi.fn(() => []),
    transactionsWithIcons: vi.fn(() => []),
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [FinancesContainer, ReactiveFormsModule],
      providers: [{ provide: FinancesStore, useValue: storeMock }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create and call loadAllData on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(storeMock.loadAllData).toHaveBeenCalled();
  });

  it('should handle filter toggle and reset form', () => {
    fixture.detectChanges();
    component.onFilterChange('month');
    expect(component.activeFilter()).toBe('month');
    expect(component.filterForm.get('selectedMonth')?.value).toBe('');
    
    component.onFilterChange('month'); 
    expect(component.activeFilter()).toBeNull();
  });

  it('should trigger fetchData after 500ms on valid form change', async () => {
    fixture.detectChanges();
    (component.activeFilter as any).set('custom');
    
    component.filterForm.patchValue({
      fromDate: '2024-01-01',
      toDate: '2024-01-31'
    });

    vi.advanceTimersByTime(500);
    expect(storeMock.loadAllData).toHaveBeenCalledWith(
      expect.objectContaining({ from: '2024-01-01', to: '2024-01-31' })
    );
  });

  it('should NOT call loadAllData if form is invalid', () => {
    fixture.detectChanges();
    (component.activeFilter as any).set('custom');
    component.filterForm.patchValue({ fromDate: '2024-12-01', toDate: '2024-01-01' }); 

    vi.advanceTimersByTime(500);
    expect(storeMock.loadAllData).not.toHaveBeenCalledWith(
      expect.objectContaining({ from: '2024-12-01' })
    );
  });
});