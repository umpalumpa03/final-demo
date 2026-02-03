import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;
  
  const mockStore = {
    loadAllData: vi.fn(),
    summaryCards: vi.fn(() => []),
    charts: vi.fn(() => []),
    categoriesWithIcons: vi.fn(() => []),
    transactionsWithIcons: vi.fn(() => []),
    loading: vi.fn(() => false),
    error: vi.fn(() => null),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [FinancesContainer],
      providers: [{ provide: FinancesStore, useValue: mockStore }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle initialization and filter changes', () => {
    expect(mockStore.loadAllData).toHaveBeenCalled();

    component.onFilterChange('custom');
    expect(component.activeFilter).toBe('custom');
    expect(mockStore.loadAllData).toHaveBeenLastCalledWith({
      from: '2026-01-15',
      to: '2026-01-31'
    });
  });

  it('should debounce form changes and handle input', async () => {
    const event = { target: { value: '2026-05-01' } } as any;
    component.handleInput('fromDate', event);
    expect(component.filterForm.get('fromDate')?.value).toBe('2026-05-01');

    component.filterForm.patchValue({ fromDate: '2026-02-01' });
    await new Promise(r => setTimeout(r, 550)); 
    expect(mockStore.loadAllData).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    const control = component.filterForm.get('fromDate');
    control?.setValue('invalid');
    expect(component.filterForm.valid).toBe(false);
    
    control?.setValue('2026-01-01');
    expect(component.filterForm.valid).toBe(true);
  });
});