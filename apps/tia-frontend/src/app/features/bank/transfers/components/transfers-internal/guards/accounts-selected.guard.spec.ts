import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';
import { internalAccountsSelectedGuard } from './accounts-selected.guard';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('internalAccountsSelectedGuard', () => {
  let mockStore: any;
  let routerMock: any;

  beforeEach(() => {
    mockStore = {
      senderAccount: signal<any>(null),
      receiverOwnAccount: signal<any>(null),
    };

    routerMock = {
      parseUrl: vi.fn((url: string) => url),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TransferStore, useValue: mockStore },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('returns true when both accounts selected', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.receiverOwnAccount.set({ id: 'r1' });

    const result = TestBed.runInInjectionContext(() =>
      internalAccountsSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
    expect(routerMock.parseUrl).not.toHaveBeenCalled();
  });

  it('redirects when sender missing', () => {
    mockStore.receiverOwnAccount.set({ id: 'r1' });

    const result = TestBed.runInInjectionContext(() =>
      internalAccountsSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe('/bank/transfers/internal');
    expect(routerMock.parseUrl)
      .toHaveBeenCalledWith('/bank/transfers/internal');
  });

  it('redirects when recipient missing', () => {
    mockStore.senderAccount.set({ id: 's1' });

    const result = TestBed.runInInjectionContext(() =>
      internalAccountsSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe('/bank/transfers/internal');
  });
});
