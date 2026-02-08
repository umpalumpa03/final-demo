import { TestBed } from '@angular/core/testing';
import { ApproveCardsStore } from './approve-cards.store';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { patchState } from '@ngrx/signals';

describe('ApproveCardsStore', () => {
  let store: any;
  let serviceMock: any;

  beforeEach(() => {
    vi.useFakeTimers();

    serviceMock = {
      getPendingCards: vi.fn(),
      changeCardStatus: vi.fn(),
      getCardPermissions: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ApproveCardsStore,
        { provide: ApproveCardsService, useValue: serviceMock },
      ],
    });

    store = TestBed.inject(ApproveCardsStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default state', () => {
    expect(store.cards()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.success()).toBeNull();
    expect(store.count()).toBe(0);
  });

  it('should load cards and update state on success', () => {
    const mockCards = [{ id: '1', nickname: 'Test' }];
    serviceMock.getPendingCards.mockReturnValue(of(mockCards));

    store.load();

    expect(store.cards()).toEqual(mockCards);
    expect(store.isLoading()).toBe(false);
    expect(store.count()).toBe(1);
  });

  it('should handle errors during load', () => {
    serviceMock.getPendingCards.mockReturnValue(
      throwError(() => new Error('Fail')),
    );

    store.load();

    expect(store.error()).toBe('Fail');
    expect(store.isLoading()).toBe(false);
  });

  it('should load permissions and update state', () => {
    const mockPerms = [{ value: 'atm', displayName: 'ATM' }];
    serviceMock.getCardPermissions.mockReturnValue(of(mockPerms));

    store.loadPerrmisions();

    expect(store.permissions()).toEqual(mockPerms);
    expect(store.isLoading()).toBe(false);
  });

  it('should update card status, show success message, and clear it after timeout', async () => {
    const mockCard = { id: '123', nickname: 'Test' };
    serviceMock.changeCardStatus.mockReturnValue(of({}));

    patchState(store, { cards: [mockCard] });

    store.updateStatus({ cardId: '123', status: 'ACTIVE', permissions: [] });

    await Promise.resolve();

    expect(store.cards().length).toBe(0);
    expect(store.success()).toBe('success');

    vi.advanceTimersByTime(4000);

    expect(store.success()).toBeNull();
  });

  it('should handle errors during loadPermissions', () => {
    serviceMock.getCardPermissions.mockReturnValue(
      throwError(() => new Error('Perm Fail')),
    );

    store.loadPerrmisions();

    expect(store.error()).toBe('Perm Fail');
    expect(store.isLoading()).toBe(false);
  });
});
