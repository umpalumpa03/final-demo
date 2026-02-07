import { TestBed } from '@angular/core/testing';
import { TransferInternalService } from './transfer.internal.service';
import { TransferStore } from '../store/transfers.store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransfersApiService } from './transfersApi.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransferInternalService', () => {
  let service: TransferInternalService;
  let transferStoreMock: any;
  let routerMock: any;
  let locationMock: any;
  let transfersApiMock: any;
  let storeMock: any;

  beforeEach(() => {
    transferStoreMock = {
      setSenderAccount: vi.fn(),
      setReceiverOwnAccount: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      setTransferSuccess: vi.fn(),
      setRequiresOtp: vi.fn(),
      setChallengeId: vi.fn(),
      senderAccount: signal({ id: '1', balance: 1000 }),
      receiverOwnAccount: signal({ id: '2', iban: 'GB123' }),
      amount: signal(100),
      description: signal('Test'),
      challengeId: signal('challenge-123'),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    locationMock = {
      back: vi.fn(),
    };

    transfersApiMock = {
      transferToOwn: vi.fn(),
      verifyTransfer: vi.fn(),
      transferCrossCurrency: vi.fn(),
      getConversionRate: vi.fn(),
    };

    storeMock = {
      dispatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferInternalService,
        { provide: TransferStore, useValue: transferStoreMock },
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: TransfersApiService, useValue: transfersApiMock },
      ],
    });

    service = TestBed.inject(TransferInternalService);
    vi.clearAllMocks();
  });

  describe('handleFromAccountSelect', () => {
    it('deselects when clicking same account', () => {
      const acc = { id: '1' } as any;
      service.handleFromAccountSelect(acc, acc);
      expect(transferStoreMock.setSenderAccount).toHaveBeenCalledWith(null);
    });

    it('selects when clicking different account', () => {
      const acc = { id: '2' } as any;
      const current = { id: '1' } as any;
      service.handleFromAccountSelect(acc, current);
      expect(transferStoreMock.setSenderAccount).toHaveBeenCalledWith(acc);
    });

    it('selects when nothing selected', () => {
      const acc = { id: '1' } as any;
      service.handleFromAccountSelect(acc, null);
      expect(transferStoreMock.setSenderAccount).toHaveBeenCalledWith(acc);
    });
  });

  describe('handleToAccountSelect', () => {
    it('deselects when clicking same account', () => {
      const acc = { id: '1' } as any;
      service.handleToAccountSelect(acc, acc);
      expect(transferStoreMock.setReceiverOwnAccount).toHaveBeenCalledWith(null);
    });

    it('selects when clicking different account', () => {
      const acc = { id: '2' } as any;
      const current = { id: '1' } as any;
      service.handleToAccountSelect(acc, current);
      expect(transferStoreMock.setReceiverOwnAccount).toHaveBeenCalledWith(acc);
    });

    it('selects when nothing selected', () => {
      const acc = { id: '1' } as any;
      service.handleToAccountSelect(acc, null);
      expect(transferStoreMock.setReceiverOwnAccount).toHaveBeenCalledWith(acc);
    });
  });

  describe('handleAmountGoBack', () => {
    it('should set amount, description and navigate back', () => {
      service.handleAmountGoBack(100, 'Test description');

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(100);
      expect(transferStoreMock.setDescription).toHaveBeenCalledWith('Test description');
      expect(locationMock.back).toHaveBeenCalled();
    });
  });

  describe('handleAmountInput', () => {
    it('should set amount and mark insufficient balance when amount exceeds balance', () => {
      service.handleAmountInput(2000);

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(2000);
      expect(transferStoreMock.setInsufficientBalance).toHaveBeenCalledWith(true);
    });

    it('should set amount and clear insufficient balance when amount is valid', () => {
      service.handleAmountInput(500);

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(500);
      expect(transferStoreMock.setInsufficientBalance).toHaveBeenCalledWith(false);
    });
  });

  describe('handleToOwnTransfer', () => {
    it('should not transfer when sender account is missing', () => {
      transferStoreMock.senderAccount.set(null);

      service.handleToOwnTransfer();

      expect(transfersApiMock.transferToOwn).not.toHaveBeenCalled();
    });

    it('should not transfer when amount is 0', () => {
      transferStoreMock.amount.set(0);

      service.handleToOwnTransfer();

      expect(transfersApiMock.transferToOwn).not.toHaveBeenCalled();
    });

    it('should call API with correct parameters', () => {
      transfersApiMock.transferToOwn.mockReturnValue(of({ success: true }));

      service.handleToOwnTransfer();

      expect(transferStoreMock.setLoading).toHaveBeenCalledWith(true);
      expect(transfersApiMock.transferToOwn).toHaveBeenCalledWith({
        senderAccountId: '1',
        receiverAccountId: '2',
        description: 'Test',
        amountToSend: 100,
      });
    });

    it('should handle error response', () => {
      transfersApiMock.transferToOwn.mockReturnValue(
        throwError(() => ({ error: { message: 'Transfer failed' } }))
      );

      service.handleToOwnTransfer();

      expect(transferStoreMock.setError).toHaveBeenCalledWith('Transfer failed');
    });
  });

  describe('verifyTransfer', () => {
    it('should not verify when challengeId is missing', () => {
      transferStoreMock.challengeId.set(null);

      service.verifyTransfer();

      expect(transfersApiMock.verifyTransfer).not.toHaveBeenCalled();
    });

    it('should call API with challengeId', () => {
      transfersApiMock.verifyTransfer.mockReturnValue(of({ success: true }));

      service.verifyTransfer();

      expect(transfersApiMock.verifyTransfer).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
      });
    });

    it('should call API with code when provided', () => {
      transfersApiMock.verifyTransfer.mockReturnValue(of({ success: true }));

      service.verifyTransfer('123456');

      expect(transfersApiMock.verifyTransfer).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
        code: '123456',
      });
    });
  });

  describe('handleCrossCurrencyTransfer', () => {
    it('should not transfer when sender account is missing', () => {
      transferStoreMock.senderAccount.set(null);

      service.handleCrossCurrencyTransfer(false);

      expect(transfersApiMock.transferCrossCurrency).not.toHaveBeenCalled();
    });

    it('should call API with isReverse flag', () => {
      transfersApiMock.transferCrossCurrency.mockReturnValue(of({ success: true }));

      service.handleCrossCurrencyTransfer(true);

      expect(transfersApiMock.transferCrossCurrency).toHaveBeenCalledWith({
        senderAccountId: '1',
        receiverAccountId: '2',
        description: 'Test',
        amountToSend: 100,
        isReverse: true,
      });
    });
  });

  describe('fetchConversionRate', () => {
    it('should call success callback with rate', () => {
      const onSuccess = vi.fn();
      transfersApiMock.getConversionRate.mockReturnValue(
        of({ success: true, rate: 1.5 })
      );

      service.fetchConversionRate('EUR', 'USD', onSuccess);

      expect(onSuccess).toHaveBeenCalledWith(1.5);
    });

    it('should call error callback on failure', () => {
      const onError = vi.fn();
      transfersApiMock.getConversionRate.mockReturnValue(
        throwError(() => new Error('Failed'))
      );

      service.fetchConversionRate('EUR', 'USD', vi.fn(), onError);

      expect(onError).toHaveBeenCalled();
    });
  });
});
