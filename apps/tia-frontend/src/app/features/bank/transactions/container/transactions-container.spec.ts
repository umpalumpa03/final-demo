import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsContainer } from './transactions-container';
import { TransactionsFacadeService } from '../services/transactions-facade.service';
import { TransactionsViewModelService } from '../services/transactions-view-model.service';
import { TransactionsActionsService } from '../services/transactions-actions.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { ActivatedRoute, Router } from '@angular/router';

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  const mockFacade = {
    initializePage: vi.fn(),
    updateFilters: vi.fn(),
    items: vi.fn(() => [] as ITransactions[]),
    filters: vi.fn(() => ({})),
    isLoading: vi.fn(() => false),
    categoryOptions: vi.fn(() => []),
    loadMore: vi.fn(),
    createCategory: vi.fn(),
    categoryOptionsForModal: vi.fn(() => []),
    retryLoad: vi.fn(),
    transactionError: vi.fn(() => null),
  };

  const mockVm = {
    accountOptions: vi.fn(() => []),
    currencyOptions: vi.fn(() => []),
    totalTransactionsString: vi.fn(() => ''),
    tableConfig: vi.fn(() => ({ headers: [], rows: [] })),
    isEmpty: vi.fn(() => true),
  };

  const mockActions = {
    openCategorizeModal: vi.fn(),
    handleRepeatAction: vi.fn(),
    alertMessage: vi.fn(() => null),
    alertType: vi.fn(() => 'warning'),
    isCategorizeModalOpen: vi.fn(() => false),
    selectedTransaction: vi.fn(() => null),
    closeCategorizeModal: vi.fn(),
    saveCategory: vi.fn(),
    exportSingleTransaction: vi.fn(),
    exportTransactionsTable: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TransactionsContainer, {
        set: {
          providers: [
            { provide: TransactionsFacadeService, useValue: mockFacade },
            { provide: TransactionsViewModelService, useValue: mockVm },
            { provide: TransactionsActionsService, useValue: mockActions },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;

    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize page on init', () => {
    component.ngOnInit();
    expect(mockFacade.initializePage).toHaveBeenCalled();
  });

  it('should delegate filter updates to facade and update URL', () => {
    const filters = { searchCriteria: 'test' };
    component.onFiltersChange(filters);

    expect(mockFacade.updateFilters).toHaveBeenCalledWith(filters);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should delegate retry load to facade', () => {
    component.retryLoad();
    expect(mockFacade.retryLoad).toHaveBeenCalled();
  });

  describe('onTableAction', () => {
    const mockTrx = { id: '123', amount: 100 };

    beforeEach(() => {
      mockFacade.items.mockReturnValue([mockTrx] as any);
    });

    it('should open categorize modal if action is categorize', () => {
      component.onTableAction({ action: 'categorize', rowId: '123' } as any);
      expect(mockActions.openCategorizeModal).toHaveBeenCalledWith(mockTrx);
    });

    it('should handle repeat action if action is repeat', () => {
      component.onTableAction({ action: 'repeat', rowId: '123' } as any);
      expect(mockActions.handleRepeatAction).toHaveBeenCalledWith(mockTrx);
    });

    it('should handle extract action if action is extract', () => {
      component.onTableAction({ action: 'extract', rowId: '123' } as any);
      expect(mockActions.exportSingleTransaction).toHaveBeenCalledWith(mockTrx);
    });

    it('should do nothing if transaction is not found', () => {
      mockFacade.items.mockReturnValue([]);
      component.onTableAction({ action: 'categorize', rowId: '999' } as any);

      expect(mockActions.openCategorizeModal).not.toHaveBeenCalled();
      expect(mockActions.handleRepeatAction).not.toHaveBeenCalled();
      expect(mockActions.exportSingleTransaction).not.toHaveBeenCalled();
    });
  });
});
