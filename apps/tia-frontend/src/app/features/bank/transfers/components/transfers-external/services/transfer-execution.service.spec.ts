import { TestBed } from '@angular/core/testing';
import { TransferExecutionService } from './transfer-execution.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Router } from '@angular/router';

describe('TransferExecutionService', () => {
  let service: TransferExecutionService;
  let mockStore: any;
  let mockApi: any;
  let ngrxStore: MockStore;
  let mockRouter: any;

  beforeEach(() => {
    mockApi = {
      transferSameBank: vi.fn(),
      transferExternalBank: vi.fn(),
      verifyTransfer: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockStore = {
      senderAccount: signal({ id: 's1', currency: 'GEL' }),
      selectedRecipientAccount: signal({ iban: 'GE001' }),
      recipientInput: signal('GE_EXT_IBAN'),
      amount: signal(100),
      description: signal('Test Transfer'),
      challengeId: signal('chal-123'),
      manualRecipientName: signal('John Doe'),
      setLoading: vi.fn(),
      setError: vi.fn(),
      setChallengeId: vi.fn(),
      setRequiresOtp: vi.fn(),
      setTransferSuccess: vi.fn(),
      setSenderAccount: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferExecutionService,
        provideMockStore(),
        { provide: TransferStore, useValue: mockStore },
        { provide: TransfersApiService, useValue: mockApi },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(TransferExecutionService);
    ngrxStore = TestBed.inject(MockStore);
    vi.spyOn(ngrxStore, 'dispatch');
  });

  describe('handleSameBankTransfer', () => {
    it('should return early if requirements are missing', () => {
      mockStore.amount.set(0);
      service.handleSameBankTransfer();
      expect(mockStore.setLoading).not.toHaveBeenCalled();
    });

    it('should handle successful transfer requiring OTP', () => {
      const response = { verify: { method: 'SMS', challengeId: 'c1' } };
      mockApi.transferSameBank.mockReturnValue(of(response));

      service.handleSameBankTransfer();

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(true);
      expect(mockStore.setLoading).toHaveBeenLastCalledWith(false);
    });

    it('should trigger verifyTransfer automatically if no OTP is required', () => {
      const response = { verify: { method: null, challengeId: 'c1' } };
      mockApi.transferSameBank.mockReturnValue(of(response));
      mockApi.verifyTransfer.mockReturnValue(of({ success: true }));

      service.handleSameBankTransfer();

      expect(mockApi.verifyTransfer).toHaveBeenCalled();
    });

    it('should handle API error', () => {
      mockApi.transferSameBank.mockReturnValue(
        throwError(() => ({ error: { message: 'Failure' } })),
      );

      service.handleSameBankTransfer();

      expect(mockStore.setError).toHaveBeenLastCalledWith('Failure');
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('handleOtherBankTransfer', () => {
    it('should return early if sender or receiver data is invalid', () => {
      mockStore.recipientInput.set('');
      service.handleOtherBankTransfer();
      expect(mockApi.transferExternalBank).not.toHaveBeenCalled();
    });

    it('should execute external transfer successfully', () => {
      const response = { verify: { method: 'EMAIL', challengeId: 'c2' } };
      mockApi.transferExternalBank.mockReturnValue(of(response));

      service.handleOtherBankTransfer();

      expect(mockStore.setChallengeId).toHaveBeenCalledWith('c2');
      expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(true);
    });

    it('should handle API error with fallback message', () => {
      mockApi.transferExternalBank.mockReturnValue(throwError(() => ({})));

      service.handleOtherBankTransfer();

      expect(mockStore.setError).toHaveBeenLastCalledWith('Transfer failed');
    });

    it('should navigate to accounts and reset sender on 400 error', () => {
      mockApi.transferExternalBank.mockReturnValue(
        throwError(() => ({ status: 400 })),
      );

      service.handleOtherBankTransfer();

      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/accounts',
      ]);
    });
  });

  describe('verifyTransfer', () => {
    it('should return early if challengeId is missing', () => {
      mockStore.challengeId.set(null);
      service.verifyTransfer();
      expect(mockStore.setLoading).not.toHaveBeenCalled();
    });

    it('should dispatch loadAccounts and set success on successful verification', () => {
      mockApi.verifyTransfer.mockReturnValue(of({ success: true }));

      service.verifyTransfer('123456');

      expect(mockStore.setTransferSuccess).toHaveBeenCalledWith(true);
      expect(ngrxStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({ forceRefresh: true }),
      );
    });

    it('should handle verification error', () => {
      mockApi.verifyTransfer.mockReturnValue(
        throwError(() => ({ error: { message: 'Invalid OTP' } })),
      );

      service.verifyTransfer('000000');

      expect(mockStore.setError).toHaveBeenLastCalledWith('Invalid OTP');
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });
  });
});
