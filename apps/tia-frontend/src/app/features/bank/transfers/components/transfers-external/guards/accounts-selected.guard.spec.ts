import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';
import { accountsSelectedGuard } from './accounts-selected.guard';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('accountsSelectedGuard', () => {
  let router: Router;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      senderAccount: signal<any>(null),
      selectedRecipientAccount: signal<any>(null),
      recipientType: signal<string | null>(null),
      manualRecipientName: signal<string>(''),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: TransferStore, useValue: mockStore },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return true if both sender and recipient accounts are selected', () => {
    mockStore.senderAccount.set({ id: 'sender-1' });
    mockStore.selectedRecipientAccount.set({ id: 'recipient-1' });

    const result = TestBed.runInInjectionContext(() =>
      accountsSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
