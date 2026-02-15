import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsFilters } from './transactions-filters';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { TransactionsActionsService } from '../../services/transactions-actions.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('TransactionsFilters', () => {
  let component: TransactionsFilters;
  let fixture: ComponentFixture<TransactionsFilters>;

  const mockActionsService = {
    isFiltersOpen: signal(false),
    toggleFilters: vi.fn(),
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [
        TransactionsFilters,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TransactionsActionsService, useValue: mockActionsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsFilters);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categoryOptions', []);
    fixture.componentRef.setInput('accountOptions', []);
    fixture.componentRef.setInput('currencyOptions', []);
    fixture.componentRef.setInput('initialFilters', null);

    fixture.detectChanges();
  });

  afterEach(() => {});

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.presenter).toBeTruthy();
  });

  const categories = [{ label: 'Food', value: '1' }];

  it('should emit filterChange when presenter signals change', () => {
    const emitSpy = vi.spyOn(component.filterChange, 'emit');
    const mockFilter = { searchCriteria: 'test' } as any;

    component.presenter.filtersChanged.set(mockFilter);

    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(mockFilter);
  });

  it('should interact with presenter form', () => {
    component.presenter.filterForm.patchValue({ searchCriteria: 'UI Test' });
    expect(component.presenter.filterForm.value.searchCriteria).toBe('UI Test');
  });
});
