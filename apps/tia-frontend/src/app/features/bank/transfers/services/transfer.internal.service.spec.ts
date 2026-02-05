import { TestBed } from '@angular/core/testing';
import { TransferInternalService } from './transfer.internal.service';
import { TransferStore } from '../store/transfers.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('TransferInternalService', () => {
  let service: TransferInternalService;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      setSenderAccount: vi.fn(),
      setReceiverOwnAccount: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferInternalService,
        { provide: TransferStore, useValue: mockStore },
      ],
    });

    service = TestBed.inject(TransferInternalService);
  });

  describe('handleFromAccountSelect', () => {
    it('should deselect account when clicking the same account', () => {
      const account = { id: 'acc1', name: 'Account 1' } as any;
      const currentSelection = { id: 'acc1', name: 'Account 1' } as any;

      service.handleFromAccountSelect(account, currentSelection);

      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
    });

    it('should select account when clicking different account', () => {
      const account = { id: 'acc2', name: 'Account 2' } as any;
      const currentSelection = { id: 'acc1', name: 'Account 1' } as any;

      service.handleFromAccountSelect(account, currentSelection);

      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(account);
    });

    it('should select account when no current selection exists', () => {
      const account = { id: 'acc1', name: 'Account 1' } as any;

      service.handleFromAccountSelect(account, null);

      expect(mockStore.setSenderAccount).toHaveBeenCalledWith(account);
    });
  });

  describe('handleToAccountSelect', () => {
    it('should deselect account when clicking the same account', () => {
      const account = { id: 'acc1', name: 'Account 1' } as any;
      const currentSelected = { id: 'acc1', name: 'Account 1' } as any;

      service.handleToAccountSelect(account, currentSelected);

      expect(mockStore.setReceiverOwnAccount).toHaveBeenCalledWith(null);
    });

    it('should select account when clicking different account', () => {
      const account = { id: 'acc2', name: 'Account 2' } as any;
      const currentSelected = { id: 'acc1', name: 'Account 1' } as any;

      service.handleToAccountSelect(account, currentSelected);

      expect(mockStore.setReceiverOwnAccount).toHaveBeenCalledWith(account);
    });

    it('should select account when no current selection exists', () => {
      const account = { id: 'acc1', name: 'Account 1' } as any;

      service.handleToAccountSelect(account, null);

      expect(mockStore.setReceiverOwnAccount).toHaveBeenCalledWith(account);
    });
  });
});
