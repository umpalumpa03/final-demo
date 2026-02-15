import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';
import { fromAccountSelectedGuard } from './from-account-selected.guard';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('fromAccountSelectedGuard', () => {
  let mockStore: any;
  let routerMock: any;

  beforeEach(() => {
    mockStore = {
      senderAccount: signal<any>(null),
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

  it('returns true when sender account is selected', () => {
    mockStore.senderAccount.set({ id: 's1', friendlyName: 'Account 1' });

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
    expect(routerMock.parseUrl).not.toHaveBeenCalled();
  });

  it('redirects to from-account page when sender account is null', () => {
    mockStore.senderAccount.set(null);

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe('/bank/transfers/internal/from-account');
    expect(routerMock.parseUrl).toHaveBeenCalledWith(
      '/bank/transfers/internal/from-account',
    );
  });

  it('redirects to from-account page when sender account is undefined', () => {
    mockStore.senderAccount.set(undefined);

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe('/bank/transfers/internal/from-account');
    expect(routerMock.parseUrl).toHaveBeenCalledWith(
      '/bank/transfers/internal/from-account',
    );
  });

  it('redirects when sender account exists but is falsy', () => {
    mockStore.senderAccount.set('');

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe('/bank/transfers/internal/from-account');
    expect(routerMock.parseUrl).toHaveBeenCalledWith(
      '/bank/transfers/internal/from-account',
    );
  });

  it('returns true when sender account has minimal required data', () => {
    mockStore.senderAccount.set({ id: '123' });

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
  });

  it('returns true when sender account is a complex object', () => {
    mockStore.senderAccount.set({
      id: 's1',
      friendlyName: 'My Account',
      balance: 1000,
      currency: 'GEL',
      iban: 'GE1234567890',
    });

    const result = TestBed.runInInjectionContext(() =>
      fromAccountSelectedGuard({} as any, {} as any),
    );

    expect(result).toBe(true);
    expect(routerMock.parseUrl).not.toHaveBeenCalled();
  });
});

