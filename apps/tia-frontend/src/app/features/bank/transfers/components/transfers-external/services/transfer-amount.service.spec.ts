import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferAmountService } from './transfer-amount.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal, DestroyRef } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('TransferAmountService', () => {
  let service: TransferAmountService;
  let mockRouter: any;
  let mockTransferStore: any;
  let mockApi: any;

  beforeEach(() => {
    vi.useFakeTimers();
    mockRouter = { navigate: vi.fn() };

    mockTransferStore = {
      amount: signal(100),
      senderAccount: signal({ id: 'acc1', balance: 1000 }),
      recipientType: signal('iban-same-bank'),
      setAmount: vi.fn((val) => mockTransferStore.amount.set(val)),
      setInsufficientBalance: vi.fn(),
      updateFeeInfo: vi.fn(),
      setFeeLoading: vi.fn(),
      setDescription: vi.fn(),
    };

    mockApi = {
      getFee: vi.fn().mockReturnValue(of({ fee: 5 })),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferAmountService,
        DestroyRef,
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferAmountService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should handle amount input with insufficient balance instantly without triggering fee API', () => {
    service.handleAmountInput(2000);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalledWith(true);
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 2000);
    expect(mockApi.getFee).not.toHaveBeenCalled();
  });

  it('should handle same bank transfer input directly', () => {
    service.handleAmountInput(100);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalledWith(
      false,
    );
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 100);
  });

  it('should trigger fee loading and subject for external bank transfers', () => {
    mockTransferStore.recipientType.set('iban-different-bank');
    service.handleAmountInput(100);
    expect(mockTransferStore.setFeeLoading).toHaveBeenCalledWith(true);
    vi.advanceTimersByTime(300);
    expect(mockApi.getFee).toHaveBeenCalledWith('acc1', 100);
  });

  it('should reset info on zero or negative amount', () => {
    service.handleAmountInput(0);
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should navigate back in handleAmountGoBack and persist values', () => {
    service.handleAmountGoBack(150, 'Gift');
    expect(mockTransferStore.setAmount).toHaveBeenCalledWith(150);
    expect(mockTransferStore.setDescription).toHaveBeenCalledWith('Gift');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should validate balance correctly based on total including fee', () => {
    const result = service.validateBalance(1100, 1000);
    expect(result).toBe(false);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalledWith(true);
  });

  it('should process fee calculation and update store when amount matches', () => {
    mockTransferStore.recipientType.set('iban-different-bank');
    mockTransferStore.amount.set(100); 
    mockApi.getFee.mockReturnValue(of({ fee: 15 }));

    (service as any).feeUpdateSubject.next({ amount: 100, accountId: 'acc1' });

    vi.advanceTimersByTime(300);

    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(15, 115);
    expect(mockTransferStore.setFeeLoading).toHaveBeenCalledWith(false);
  });

  it('should not update fee info if amount changed before API returned', () => {
    mockTransferStore.recipientType.set('iban-different-bank');
    mockTransferStore.amount.set(200);
    mockApi.getFee.mockReturnValue(of({ fee: 15 }));

    (service as any).feeUpdateSubject.next({ amount: 100, accountId: 'acc1' });

    vi.advanceTimersByTime(300);

    expect(mockTransferStore.updateFeeInfo).not.toHaveBeenCalled();
    expect(mockTransferStore.setFeeLoading).toHaveBeenCalledWith(false);
  });

  it('should handle API error gracefully', () => {
    mockTransferStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(throwError(() => new Error('API Error')));

    (service as any).feeUpdateSubject.next({ amount: 100, accountId: 'acc1' });

    vi.advanceTimersByTime(300);

    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
    expect(mockTransferStore.setFeeLoading).toHaveBeenCalledWith(false);
  });
});
