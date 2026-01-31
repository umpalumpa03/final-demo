import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;
  
  const mockStore = {
    summary: signal(null),
    loading: signal(false),
    error: signal(null),
    summaryCards: signal([]),
    charts: signal([]),
    loadAllData: vi.fn(), 
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

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should update filter and load data', () => {
    component.onFilterChange('custom');
    expect(mockStore.loadAllData).toHaveBeenCalled();
  });

  it('should handle input date change', () => {
    const event = { target: { value: '2026-01-01' } } as any;
    component.handleInput('fromDate', event);
    expect(component.filterForm.get('fromDate')?.value).toBe('2026-01-01');
  });
});