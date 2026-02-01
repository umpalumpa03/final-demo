import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsFilters } from './transactions-filters';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransactionsFilters', () => {
  let component: TransactionsFilters;
  let fixture: ComponentFixture<TransactionsFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsFilters],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsFilters);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categoryOptions', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map form values correctly and emit after 400ms debounce', () => {
    vi.useFakeTimers();

    const emitSpy = vi.spyOn(component.filterChange, 'emit');

    const mockFormValue = {
      searchCriteria: 'Test Search',
      accountIban: 'GE123',
      amountFrom: 100,
      currency: 'GEL',
    };

    component.filterForm.patchValue(mockFormValue as any);

    vi.advanceTimersByTime(400);

    expect(emitSpy).toHaveBeenCalledWith({
      searchCriteria: 'Test Search',
      iban: 'GE123',
      amountFrom: 100,
      amountTo: undefined,
      category: undefined,
      currency: 'GEL',
      dateFrom: undefined,
      dateTo: undefined,
    });

    vi.useRealTimers();
  });
});
