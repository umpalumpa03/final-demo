import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { TransferAmountService } from './transfer-amount.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('TransferAmountService', () => {
  let service: TransferAmountService;
  let mockStore: any;
  let mockApi: any;
  let mockLocation: any;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLocation = { back: vi.fn() };
    mockApi = { getFee: vi.fn() };

    mockStore = {
      amount: signal(0),
      senderAccount: signal({ id: 'acc-1', balance: 1000 }),
      recipientType: signal('phone'),
      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      updateFeeInfo: vi.fn(),
      setFeeLoading: vi.fn(),
      setDescription: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferAmountService,
        { provide: Location, useValue: mockLocation },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferAmountService);
  });

  describe('handleAmountInput', () => {
    it('should set insufficient balance if amount > balance', () => {
      mockStore.senderAccount.set({ balance: 100 });
      service.handleAmountInput(150);

      expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(true);
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 150);
    });

    it('should update info directly for internal transfers (same bank)', () => {
      mockStore.recipientType.set('phone');
      service.handleAmountInput(50);

      expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(false);
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 50);
    });

    it('should trigger fee calculation for external bank transfers', () => {
      mockStore.recipientType.set('iban-different-bank');
      service.handleAmountInput(50);

      expect(mockStore.setFeeLoading).toHaveBeenCalledWith(true);
      mockApi.getFee.mockReturnValue(of(0));
      vi.advanceTimersByTime(300);
      expect(mockApi.getFee).toHaveBeenCalled();
    });

    it('should handle zero or negative amounts', () => {
      service.handleAmountInput(0);
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('setupFeeCalculation (RxJS logic)', () => {
    it('should handle numeric fee response and validate balance', () => {
      mockStore.recipientType.set('iban-different-bank');
      mockStore.amount.set(100);
      mockStore.senderAccount.set({ id: 'acc-1', balance: 105 });
      mockApi.getFee.mockReturnValue(of(5)); 

      service.handleAmountInput(100);
      vi.advanceTimersByTime(300);

      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(5, 105);
      expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(false);
    });

    it('should handle object fee response and detect insufficient balance', () => {
      mockStore.recipientType.set('iban-different-bank');
      mockStore.amount.set(100);
      mockStore.senderAccount.set({ id: 'acc-1', balance: 100 });
      mockApi.getFee.mockReturnValue(of({ fee: 10 })); 

      service.handleAmountInput(100);
      vi.advanceTimersByTime(300);

      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(10, 110);
      expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(true);
    });

    it('should abort update if store amount changed during API call (tap guard)', () => {
      mockStore.recipientType.set('iban-different-bank');
      mockStore.amount.set(100);
      mockApi.getFee.mockReturnValue(of(5));

      service.handleAmountInput(100);
      mockStore.amount.set(200);

      vi.advanceTimersByTime(300);

      expect(mockStore.updateFeeInfo).not.toHaveBeenCalled();
      expect(mockStore.setFeeLoading).toHaveBeenCalledWith(false);
    });

    it('should handle API errors gracefully', () => {
      mockStore.recipientType.set('iban-different-bank');
      mockApi.getFee.mockReturnValue(throwError(() => new Error('API Error')));

      service.handleAmountInput(100);
      vi.advanceTimersByTime(300);

      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
      expect(mockStore.setFeeLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('Utility Methods', () => {
    it('should handleAmountGoBack', () => {
      service.handleAmountGoBack(100, 'Rent');
      expect(mockStore.setAmount).toHaveBeenCalledWith(100);
      expect(mockStore.setDescription).toHaveBeenCalledWith('Rent');
      expect(mockLocation.back).toHaveBeenCalled();
    });

    it('should validate transfer amount', () => {
      expect(service.handleTransfer(50, 'Valid')).toBe(true);
      expect(service.handleTransfer(0, 'Invalid')).toBe(false);
    });
  });
});
