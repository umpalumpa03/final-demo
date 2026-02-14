import { TestBed } from '@angular/core/testing';
import { TransactionsActionsService } from './transactions-actions.service';
import { TransactionsFacadeService } from './transactions-facade.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { AlertService } from '@tia/core/services/alert/alert.service'; 
import * as XLSX from 'xlsx';

vi.mock('xlsx', () => {
  return {
    utils: {
      json_to_sheet: vi.fn(),
      book_new: vi.fn(),
      book_append_sheet: vi.fn(),
    },
    writeFile: vi.fn(),
  };
});

describe('TransactionsActionsService', () => {
  let service: TransactionsActionsService;
  let router: Router;
  let facade: TransactionsFacadeService;
  let alertService: AlertService;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockTranslate = {
    instant: vi.fn((key) => `Translated: ${key}`),
  };

  const mockFacade = {
    assignCategory: vi.fn(),
    setTransactionToRepeat: vi.fn(),
    items: vi.fn().mockReturnValue([]),
  };

  const mockAlertService = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsActionsService,
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: TransactionsFacadeService, useValue: mockFacade },
        { provide: AlertService, useValue: mockAlertService }, 
      ],
    });

    service = TestBed.inject(TransactionsActionsService);
    router = TestBed.inject(Router);
    facade = TestBed.inject(TransactionsFacadeService);
    alertService = TestBed.inject(AlertService);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Modal & Category Logic', () => {
    it('should open categorize modal and set selected transaction', () => {
      const mockTrx = { id: '1' } as ITransactions;
      service.openCategorizeModal(mockTrx);
      expect(service.isCategorizeModalOpen()).toBe(true);
      expect(service.selectedTransaction()).toEqual(mockTrx);
    });

    it('should save category via facade and close modal', () => {
      const spyClose = vi.spyOn(service, 'closeCategorizeModal');

      service.saveCategory('tx-123', 'cat-456');

      expect(mockFacade.assignCategory).toHaveBeenCalledWith(
        'tx-123',
        'cat-456',
      );
      expect(spyClose).toHaveBeenCalled();
      expect(service.isCategorizeModalOpen()).toBe(false);
    });
  });

  describe('Alert Logic', () => {
    it('should call AlertService with correct parameters for success', () => {
      service.showValidationAlert('success', 'some.key');
      
      expect(mockTranslate.instant).toHaveBeenCalledWith('some.key');
      expect(mockAlertService.success).toHaveBeenCalledWith('Translated: some.key', {
        variant: 'dismissible',
        title: 'Success',
      });
    });

    it('should call AlertService with correct parameters for error', () => {
      service.showValidationAlert('error', 'error.key');
      
      expect(mockAlertService.error).toHaveBeenCalledWith('Translated: error.key', {
        variant: 'dismissible',
        title: 'Error',
      });
    });

    it('should call AlertService with correct parameters for warning', () => {
      service.showValidationAlert('warning', 'warning.key');
      
      expect(mockAlertService.warning).toHaveBeenCalledWith('Translated: warning.key', {
        variant: 'dismissible',
        title: 'Warning',
      });
    });
  });

  describe('Repeat & Navigation Logic', () => {
    it('should show warning alert if transaction type is credit', () => {
      const trx = { transactionType: 'credit' } as ITransactions;
      const spyAlert = vi.spyOn(service, 'showValidationAlert');

      service.handleRepeatAction(trx);

      expect(spyAlert).toHaveBeenCalledWith(
        'warning',
        'transactions.alerts.income_warning',
      );
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should show warning alert if transfer type is Loan', () => {
      const trx = { transactionType: 'debit', transferType: 'Loan' } as ITransactions;
      const spyAlert = vi.spyOn(service, 'showValidationAlert');

      service.handleRepeatAction(trx);

      expect(spyAlert).toHaveBeenCalledWith(
        'warning',
        'transactions.alerts.loan_warning',
      );
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /bank/paybill for BillPayment', () => {
      const trx = {
        transactionType: 'debit',
        transferType: 'BillPayment',
      } as ITransactions;

      service.handleRepeatAction(trx);

      expect(mockFacade.setTransactionToRepeat).toHaveBeenCalledWith(trx);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill']);
    });

    it('should navigate to internal transfers for OwnAccount', () => {
        const trx = {
          transactionType: 'debit',
          transferType: 'OwnAccount',
        } as ITransactions;
  
        service.handleRepeatAction(trx);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/internal']);
      });

    it('should navigate to external transfers for ToSomeoneSameBank', () => {
        const trx = {
          transactionType: 'debit',
          transferType: 'ToSomeoneSameBank',
        } as ITransactions;
  
        service.handleRepeatAction(trx);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/external']);
      });

    it('should navigate to default transfers route for other types', () => {
      const trx = {
        transactionType: 'debit',
        transferType: 'UnknownType',
      } as ITransactions;

      service.handleRepeatAction(trx);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/']);
    });
  });

  describe('Export Logic', () => {
    const mockTrx = {
      id: '123',
      createdAt: '2022-01-01',
      amount: 100,
      currency: 'GEL',
      description: 'Test Desc',
      transactionType: 'debit',
      transferType: 'BillPayment',
      category: 'Groceries',
    } as any;

    it('should show alert if there is no data to export', () => {
      vi.mocked(mockFacade.items).mockReturnValue([]); 

      const spyAlert = vi.spyOn(service, 'showValidationAlert');

      service.exportTransactionsTable();
      expect(spyAlert).toHaveBeenCalledWith(
        'warning',
        'transactions.alerts.no_data_to_export',
      );
      expect(XLSX.writeFile).not.toHaveBeenCalled();
    });

    it('should export table correctly (Category as String)', () => {
      vi.mocked(mockFacade.items).mockReturnValue([mockTrx]);

      service.exportTransactionsTable();

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalled();
      const fileNameArgs = vi.mocked(XLSX.writeFile).mock.calls[0][1];
      expect(fileNameArgs).toContain('Transactions_Table_');
      expect(fileNameArgs).toContain('.xlsx');
    });

    it('should export single transaction correctly (Category as Object)', () => {
      const objCatTrx = {
        ...mockTrx,
        id: '999',
        category: { categoryName: 'Tech' },
      };

      service.exportSingleTransaction(objCatTrx);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalled();

      const fileNameArgs = vi.mocked(XLSX.writeFile).mock.calls[0][1];
      expect(fileNameArgs).toBe('Transaction_999.xlsx');
    });
  });
  
  describe('Filters Logic', () => {
    it('should toggle filter state', () => {
        expect(service.isFiltersOpen()).toBe(false);
        service.toggleFilters();
        expect(service.isFiltersOpen()).toBe(true);
        service.toggleFilters();
        expect(service.isFiltersOpen()).toBe(false);
    });
  });
});