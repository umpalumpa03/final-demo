import { TestBed } from '@angular/core/testing';
import { FinancesStore } from './finances.store';
import { FinancesService } from '../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesStore', () => {
  let store: any;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = { getSummary: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        FinancesStore,
        { provide: FinancesService, useValue: serviceMock }
      ]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should update state on successful load', () => {
    const mockData = { income: 5000 };
    serviceMock.getSummary.mockReturnValue(of(mockData));

    store.loadSummary({ from: '2026-01-01' });

    expect(store.summary()).toEqual(mockData);
    expect(store.loading()).toBe(false);
  });

  it('should set error state on API failure', () => {
    serviceMock.getSummary.mockReturnValue(throwError(() => ({ status: 500 })));

    store.loadSummary({ from: 'error' });

    expect(store.error()).toBe('Server error: Invalid date format.');
    expect(store.loading()).toBe(false);
  });
});