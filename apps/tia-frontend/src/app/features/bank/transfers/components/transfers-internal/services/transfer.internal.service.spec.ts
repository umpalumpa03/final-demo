import { TestBed } from '@angular/core/testing';
import { TransferInternalService } from './transfer.internal.service';
import { TransferStore } from '../../../store/transfers.store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransferInternalService', () => {
  let service: TransferInternalService;
  let transferStoreMock: any;
  let routerMock: any;
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
      expect(transferStoreMock.setReceiverOwnAccount).toHaveBeenCalledWith(
        null,
      );
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
    it('should set amount, description and navigate to to-account', () => {
      service.handleAmountGoBack(100, 'Test description');

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(100);
      expect(transferStoreMock.setDescription).toHaveBeenCalledWith(
        'Test description',
      );
      expect(routerMock.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/to-account',
      ]);
    });
  });

  describe('handleAmountInput', () => {
    it('should set amount and mark insufficient balance when amount exceeds balance', () => {
      service.handleAmountInput(2000);

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(2000);
      expect(transferStoreMock.setInsufficientBalance).toHaveBeenCalledWith(
        true,
      );
    });

    it('should set amount and clear insufficient balance when amount is valid', () => {
      service.handleAmountInput(500);

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(500);
      expect(transferStoreMock.setInsufficientBalance).toHaveBeenCalledWith(
        false,
      );
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
        throwError(() => ({ error: { message: 'Transfer failed' } })),
      );

      service.handleToOwnTransfer();

      expect(transferStoreMock.setError).toHaveBeenCalledWith(
        'Transfer failed',
      );
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
      transfersApiMock.transferCrossCurrency.mockReturnValue(
        of({ success: true }),
      );

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
        of({ success: true, rate: 1.5 }),
      );

      service.fetchConversionRate('EUR', 'USD', onSuccess);

      expect(onSuccess).toHaveBeenCalledWith(1.5);
    });

    it('should call error callback on failure', () => {
      const onError = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      transfersApiMock.getConversionRate.mockReturnValue(
        throwError(() => new Error('Failed')),
      );

      service.fetchConversionRate('EUR', 'USD', vi.fn(), onError);

      expect(onError).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('clearInternalSelection', () => {
    it('should remove internal selection from sessionStorage', () => {
      sessionStorage.setItem('tia.internalTransfer.selection', '{}');

      service.clearInternalSelection();

      expect(sessionStorage.getItem('tia.internalTransfer.selection')).toBeNull();
    });
  });

  describe('restoreInternalSelection', () => {
    it('should do nothing when accounts array is empty', () => {
      service.restoreInternalSelection([]);

      expect(transferStoreMock.setSenderAccount).not.toHaveBeenCalled();
      expect(transferStoreMock.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should restore sender and receiver from sessionStorage when stored', () => {
      const accounts = [
        { id: '1', balance: 1000, iban: 'GB1' },
        { id: '2', balance: 2000, iban: 'GB2' },
      ] as any;
      sessionStorage.setItem(
        'tia.internalTransfer.selection',
        JSON.stringify({
          senderAccountId: '1',
          receiverOwnAccountId: '2',
        }),
      );

      service.restoreInternalSelection(accounts);

      expect(transferStoreMock.setSenderAccount).toHaveBeenCalledWith(
        accounts[0],
      );
      expect(transferStoreMock.setReceiverOwnAccount).toHaveBeenCalledWith(
        accounts[1],
      );
    });

    it('should do nothing when getItem returns null', () => {
      sessionStorage.removeItem('tia.internalTransfer.selection');

      service.restoreInternalSelection([{ id: '1' }] as any);

      expect(transferStoreMock.setSenderAccount).not.toHaveBeenCalled();
    });
  });

  describe('handleToOwnTransfer success branches', () => {
    it('should set transferSuccess and dispatch when no verify challenge', () => {
      transfersApiMock.transferToOwn.mockReturnValue(of({ success: true }));

      service.handleToOwnTransfer();

      expect(transferStoreMock.setLoading).toHaveBeenCalledWith(false);
      expect(transferStoreMock.setTransferSuccess).toHaveBeenCalledWith(true);
      expect(storeMock.dispatch).toHaveBeenCalled();
    });

    it('should set requiresOtp and navigate to verify when method is set', () => {
      transfersApiMock.transferToOwn.mockReturnValue(
        of({
          verify: { challengeId: 'ch1', method: 'otp' },
        }),
      );

      service.handleToOwnTransfer();

      expect(transferStoreMock.setChallengeId).toHaveBeenCalledWith('ch1');
      expect(transferStoreMock.setRequiresOtp).toHaveBeenCalledWith(true);
      expect(routerMock.navigate).toHaveBeenCalledWith([
        '/bank/transfers/verify',
      ]);
    });

    it('should use default description when empty', () => {
      transferStoreMock.description = signal('');
      transfersApiMock.transferToOwn.mockReturnValue(of({ success: true }));

      service.handleToOwnTransfer();

      expect(transfersApiMock.transferToOwn).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'To Own transfer',
        }),
      );
    });

    it('should not transfer when receiver has no iban', () => {
      transferStoreMock.receiverOwnAccount = signal({ id: '2' });

      service.handleToOwnTransfer();

      expect(transfersApiMock.transferToOwn).not.toHaveBeenCalled();
    });

    it('should set error with default message when error has no message', () => {
      transfersApiMock.transferToOwn.mockReturnValue(
        throwError(() => ({ error: {} })),
      );

      service.handleToOwnTransfer();

      expect(transferStoreMock.setError).toHaveBeenCalledWith('Transfer failed');
    });
  });

  describe('verifyTransfer success and error', () => {
    it('should set requiresOtp false and transferSuccess true on success', () => {
      transfersApiMock.verifyTransfer.mockReturnValue(of({ success: true }));

      service.verifyTransfer('123456');

      expect(transferStoreMock.setRequiresOtp).toHaveBeenCalledWith(false);
      expect(transferStoreMock.setTransferSuccess).toHaveBeenCalledWith(true);
      expect(storeMock.dispatch).toHaveBeenCalled();
      expect(transferStoreMock.setLoading).toHaveBeenCalledWith(false);
    });

    it('should set error from response on verify failure', () => {
      transfersApiMock.verifyTransfer.mockReturnValue(
        throwError(() => ({ error: { message: 'Invalid code' } })),
      );

      service.verifyTransfer('000000');

      expect(transferStoreMock.setLoading).toHaveBeenCalledWith(false);
      expect(transferStoreMock.setError).toHaveBeenCalledWith('Invalid code');
    });
  });

  describe('handleCrossCurrencyTransfer', () => {
    it('should not transfer when receiver account is missing', () => {
      transferStoreMock.receiverOwnAccount = signal(null);

      service.handleCrossCurrencyTransfer(false);

      expect(transfersApiMock.transferCrossCurrency).not.toHaveBeenCalled();
    });

    it('should set transferSuccess and dispatch when no verify', () => {
      transfersApiMock.transferCrossCurrency.mockReturnValue(
        of({ success: true }),
      );

      service.handleCrossCurrencyTransfer(false);

      expect(transferStoreMock.setTransferSuccess).toHaveBeenCalledWith(true);
      expect(storeMock.dispatch).toHaveBeenCalled();
    });

    it('should navigate to verify when method is set', () => {
      transfersApiMock.transferCrossCurrency.mockReturnValue(
        of({
          verify: { challengeId: 'cx1', method: 'otp' },
        }),
      );

      service.handleCrossCurrencyTransfer(true);

      expect(transferStoreMock.setRequiresOtp).toHaveBeenCalledWith(true);
      expect(routerMock.navigate).toHaveBeenCalledWith([
        '/bank/transfers/verify',
      ]);
    });

    it('should use default description when empty', () => {
      transferStoreMock.description = signal('');
      transfersApiMock.transferCrossCurrency.mockReturnValue(
        of({ success: true }),
      );

      service.handleCrossCurrencyTransfer(false);

      expect(transfersApiMock.transferCrossCurrency).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Cross-currency transfer',
        }),
      );
    });
  });

  describe('handleAmountInput', () => {
    it('should use balance 0 when sender account is null', () => {
      transferStoreMock.senderAccount = signal(null);

      service.handleAmountInput(100);

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(100);
      expect(transferStoreMock.setInsufficientBalance).toHaveBeenCalledWith(
        true,
      );
    });
  });
});
