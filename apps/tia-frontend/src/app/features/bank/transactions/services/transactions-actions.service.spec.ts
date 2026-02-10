import { TestBed } from '@angular/core/testing';
import { TransactionsActionsService } from './transactions-actions.service';
import { TransactionsFacadeService } from './transactions-facade.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

describe('TransactionsActionsService', () => {
  let service: TransactionsActionsService;
  let router: Router;
  let facade: TransactionsFacadeService;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockTranslate = {
    instant: vi.fn((key) => `Translated: ${key}`),
  };

  const mockFacade = {
    assignCategory: vi.fn(),
    setTransactionToRepeat: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsActionsService,
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: TransactionsFacadeService, useValue: mockFacade },
      ],
    });

    service = TestBed.inject(TransactionsActionsService);
    router = TestBed.inject(Router);
    facade = TestBed.inject(TransactionsFacadeService);

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
    it('should show alert and clear it after 3 seconds', () => {
      service.showValidationAlert('error', 'some.key');
      expect(service.alertMessage()).toBe('Translated: some.key');
      vi.advanceTimersByTime(3000);
      expect(service.alertMessage()).toBeNull();
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

    it('should navigate to /bank/paybill for BillPayment', () => {
      const trx = {
        transactionType: 'debit',
        transferType: 'BillPayment',
      } as ITransactions;

      service.handleRepeatAction(trx);

      expect(mockFacade.setTransactionToRepeat).toHaveBeenCalledWith(trx);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill']);
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
});
