import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionsContainer } from '../container/transactions-container';
import { TransactionsFacadeService } from '../services/transactions-facade.service';
import { TransactionsViewModelService } from '../services/transactions-view-model.service';
import { TransactionsActionsService } from '../services/transactions-actions.service';
import { createTransactionsMocks } from './transactions.test-helpers';

describe('TransactionsContainer Integration Tests', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let mocks: ReturnType<typeof createTransactionsMocks>;

  beforeEach(async () => {
    mocks = createTransactionsMocks();

    await TestBed.configureTestingModule({
      imports: [TransactionsContainer, TranslateModule.forRoot()],
    })
      .overrideComponent(TransactionsContainer, {
        set: {
          providers: [
            { provide: TransactionsFacadeService, useValue: mocks.facade },
            { provide: TransactionsActionsService, useValue: mocks.actions },
            { provide: TransactionsViewModelService, useValue: mocks.vm },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should call initializePage on ngOnInit', () => {
    expect(mocks.facade.initializePage).toHaveBeenCalled();
  });

  it('should delegate updateFilters to facade when filters change', async () => {
    vi.useFakeTimers();
    const mockFilters = { searchCriteria: 'TBC' };

    component.onFiltersChange(mockFilters);

    vi.advanceTimersByTime(400);

    expect(mocks.facade.updateFilters).toHaveBeenCalledWith(mockFilters);

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('should delegate "categorize" action to actions service', () => {
    const mockTrx = { id: 'trx_1', description: 'Gas' } as any;
    mocks.facade.items.set([mockTrx]);

    component.onTableAction({ rowId: 'trx_1', action: 'categorize' });

    expect(mocks.actions.openCategorizeModal).toHaveBeenCalledWith(mockTrx);
  });

  it('should delegate "repeat" action to actions service', () => {
    const mockTrx = { id: 'trx_2', description: 'Rent' } as any;
    mocks.facade.items.set([mockTrx]);

    component.onTableAction({ rowId: 'trx_2', action: 'repeat' });

    expect(mocks.actions.handleRepeatAction).toHaveBeenCalledWith(mockTrx);
  });

  it('should trigger exportSingleTransaction for "extract" action', () => {
    const mockTrx = { id: 'trx_3', description: 'Salary' } as any;
    mocks.facade.items.set([mockTrx]);

    component.onTableAction({ rowId: 'trx_3', action: 'extract' });

    expect(mocks.actions.exportSingleTransaction).toHaveBeenCalledWith(mockTrx);
  });

  it('should call facade.retryLoad when retry is triggered', () => {
    component.retryLoad();
    expect(mocks.facade.retryLoad).toHaveBeenCalled();
  });

  it('should ignore table actions if transaction is not in the current items list', () => {
    mocks.facade.items.set([]);
    component.onTableAction({ rowId: 'invalid_id', action: 'categorize' });

    expect(mocks.actions.openCategorizeModal).not.toHaveBeenCalled();
  });
});
