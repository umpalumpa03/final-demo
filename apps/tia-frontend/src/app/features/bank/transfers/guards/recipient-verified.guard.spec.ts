import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferStore } from '../store/transfers.store';
import { recipientVerifiedGuard } from './recipient-verified.guard';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('recipientVerifiedGuard (vitest)', () => {
  let router: Router;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      recipientInfo: signal<any>(null),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: TransferStore, useValue: mockStore },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return true if recipientInfo exists in store', () => {
    mockStore.recipientInfo.set({ fullName: 'John Doe' });

    const result = TestBed.runInInjectionContext(() =>
      recipientVerifiedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to recipient page and return false if no recipientInfo', () => {
    mockStore.recipientInfo.set(null);

    const result = TestBed.runInInjectionContext(() =>
      recipientVerifiedGuard({} as any, {} as any),
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/recipient',
    ]);
  });
});
