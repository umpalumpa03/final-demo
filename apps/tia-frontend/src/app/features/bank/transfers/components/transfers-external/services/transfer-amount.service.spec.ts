import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferAmountService } from './transfer-amount.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of,  } from 'rxjs';

vi.mock('rxjs', async () => {
  const actual = await vi.importActual('rxjs');
  return {
    ...actual,
    debounceTime: () => (source: any) => source,
  };
});

describe('TransferAmountService', () => {
  let service: TransferAmountService;
  let mockRouter: any;
  let mockTransferStore: any;
  let mockApi: any;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };
    mockTransferStore = {
      amount: signal(100),
      senderAccount: signal({ id: 'acc1', balance: 1000 }),
      recipientType: signal('iban-same-bank'),
      setAmount: vi.fn(),
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
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferAmountService);
  });

  it('should handle amount input with insufficient balance', () => {
    service.handleAmountInput(2000);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalledWith(true);
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 2000);
  });

  it('should handle same bank transfer input', () => {
    service.handleAmountInput(100);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalledWith(
      false,
    );
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 100);
  });

  it('should handle external bank transfer input', () => {
    mockTransferStore.recipientType.set('iban-different-bank');
    service.handleAmountInput(100);
    expect(mockTransferStore.setFeeLoading).toHaveBeenCalledWith(true);
  });

  it('should reset info on zero or negative amount', () => {
    service.handleAmountInput(0);
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should navigate back in handleAmountGoBack', () => {
    service.handleAmountGoBack(100, 'desc');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should handle transfer validation', () => {
    expect(service.handleTransfer(100, 'desc')).toBe(true);
    expect(service.handleTransfer(0, 'desc')).toBe(false);
  });

  it('should validate balance correctly', () => {
    expect(service.validateBalance(100, 200)).toBe(true);
    expect(service.validateBalance(300, 200)).toBe(false);
    expect(mockTransferStore.setInsufficientBalance).toHaveBeenCalled();
  });

  it('should process fee calculation from subject with object response', () => {
    mockApi.getFee.mockReturnValue(of({ fee: 10 }));
    (service as any).feeUpdateSubject.next({ amount: 100, accountId: 'acc1' });
    expect(mockTransferStore.updateFeeInfo).toHaveBeenCalledWith(10, 110);
  });
});
