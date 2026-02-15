import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createTransactionsMocks } from './transactions.test-helpers';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { TransactionsFilters } from '../components/transactions-filters/transactions-filters';
import { TransactionsActionsService } from '../services/transactions-actions.service';

describe('TransactionsFilters Integration Tests', () => {
  let component: TransactionsFilters;
  let fixture: ComponentFixture<TransactionsFilters>;
  let mocks: ReturnType<typeof createTransactionsMocks>;

  beforeEach(async () => {
    vi.useFakeTimers();
    mocks = createTransactionsMocks();

    await TestBed.configureTestingModule({
      imports: [
        TransactionsFilters,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TransactionsActionsService, useValue: mocks.actions },
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

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should sync inputs to the presenter', () => {
    const mockCategories = [{ label: 'Food', value: 'cat_1' }];
    fixture.componentRef.setInput('categoryOptions', mockCategories);

    fixture.detectChanges();

    expect(component.presenter.categoryOptions()).toEqual(mockCategories);
  });

  it('should emit filterChange when presenter form changes', () => {
    const emitSpy = vi.spyOn(component.filterChange, 'emit');

    component.presenter.filterForm.patchValue({
      searchCriteria: 'Integration Test',
    });

    vi.advanceTimersByTime(400);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ searchCriteria: 'Integration Test' }),
    );
  });

  it('should reset filters when reset button is clicked', () => {
    component.presenter.filterForm.patchValue({ searchCriteria: 'To Reset' });
    
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(
      By.css('.transactions-filters__heading app-button'),
    );

    expect(resetButton).toBeTruthy();

    resetButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.presenter.filterForm.value.searchCriteria).toBeNull();
  });

  it('should remove a specific filter when chip is clicked', () => {
    component.presenter.filterForm.patchValue({
      searchCriteria: 'Keep Me',
      amountFrom: 100,
    });
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(
      By.css('.transactions-filters__active-filters app-button'),
    );
    expect(chips.length).toBe(2);

    chips[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    const activeFilters = component.presenter.activeFilters();
    expect(activeFilters.length).toBe(1);
  });
});