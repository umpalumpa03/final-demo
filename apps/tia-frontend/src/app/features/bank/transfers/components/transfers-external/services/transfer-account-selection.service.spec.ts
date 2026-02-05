import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferAccountSelectionService } from './transfer-account-selection.service';
import { TransferStore } from '../../../store/transfers.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransferAccountSelectionService', () => {
  let service: TransferAccountSelectionService;
  let mockRouter: any;
  let mockStore: any;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };

    mockStore = {
      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setManualRecipientName: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferAccountSelectionService,
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockStore },
      ],
    });

    service = TestBed.inject(TransferAccountSelectionService);
  });

  describe('handleRecipientAccountSelect', () => {
    it('should reset amount and select new account if IDs differ', () => {
      const current = { id: 'old' } as any;
      const next = { id: 'new' } as any;

      service.handleRecipientAccountSelect(next, current);

      expect(mockStore.setAmount).toHaveBeenCalledWith(0);
      expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(false);
      expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(next);
    });

    it('should deselect (set null) if the same account is clicked', () => {
      const acc = { id: 'same' } as any;

      service.handleRecipientAccountSelect(acc, acc);

      expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);
      expect(mockStore.setAmount).not.toHaveBeenCalled();
    });
  });

  describe('handleSenderAccountSelect', () => {
    it('should reset amount and select sender if IDs differ', () => {
      const current = { id: 's1' } as any;
      const next = { id: 's2' } as any;

      service.handleSenderAccountSelect(next, current);

      expect(mockStore.setAmount).toHaveBeenCalledWith(0);
      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(next);
    });

    it('should toggle sender off if clicked again', () => {
      const acc = { id: 's1' } as any;

      service.handleSenderAccountSelect(acc, acc);

      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
    });
  });

  describe('handleContinue', () => {
    it('should navigate and set manual name for external IBAN', () => {
      const sender = { id: 's1' } as any;

      service.handleContinue(null, sender, true, 'John Doe');

      expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('John Doe');
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });

  });
});
