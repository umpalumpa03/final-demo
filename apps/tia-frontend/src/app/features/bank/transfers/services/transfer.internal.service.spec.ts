import { TestBed } from '@angular/core/testing';
import { TransferInternalService } from './transfer.internal.service';
import { TransferStore } from '../store/transfers.store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransfersApiService } from './transfersApi.service';

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransferInternalService — account select coverage', () => {
  let service: TransferInternalService;

  const transferStoreMock = {
    setSenderAccount: vi.fn(),
    setReceiverOwnAccount: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferInternalService,

        // required deps
        { provide: TransferStore, useValue: transferStoreMock },
        { provide: Store, useValue: { dispatch: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: TransfersApiService, useValue: {} },
      ],
    });

    service = TestBed.inject(TransferInternalService);
    vi.clearAllMocks();
  });

  // -----------------------------
  // handleFromAccountSelect
  // -----------------------------

  describe('handleFromAccountSelect', () => {
    it('deselects when clicking same account', () => {
      const acc = { id: '1' } as any;

      service.handleFromAccountSelect(acc, acc);

      expect(transferStoreMock.setSenderAccount)
        .toHaveBeenCalledWith(null);
    });

    it('selects when clicking different account', () => {
      const acc = { id: '2' } as any;
      const current = { id: '1' } as any;

      service.handleFromAccountSelect(acc, current);

      expect(transferStoreMock.setSenderAccount)
        .toHaveBeenCalledWith(acc);
    });

    it('selects when nothing selected', () => {
      const acc = { id: '1' } as any;

      service.handleFromAccountSelect(acc, null);

      expect(transferStoreMock.setSenderAccount)
        .toHaveBeenCalledWith(acc);
    });
  });

  // -----------------------------
  // handleToAccountSelect
  // -----------------------------

  describe('handleToAccountSelect', () => {
    it('deselects when clicking same account', () => {
      const acc = { id: '1' } as any;

      service.handleToAccountSelect(acc, acc);

      expect(transferStoreMock.setReceiverOwnAccount)
        .toHaveBeenCalledWith(null);
    });

    it('selects when clicking different account', () => {
      const acc = { id: '2' } as any;
      const current = { id: '1' } as any;

      service.handleToAccountSelect(acc, current);

      expect(transferStoreMock.setReceiverOwnAccount)
        .toHaveBeenCalledWith(acc);
    });

    it('selects when nothing selected', () => {
      const acc = { id: '1' } as any;

      service.handleToAccountSelect(acc, null);

      expect(transferStoreMock.setReceiverOwnAccount)
        .toHaveBeenCalledWith(acc);
    });
  });
});
