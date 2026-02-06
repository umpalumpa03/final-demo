import { TestBed } from '@angular/core/testing';
import { ApproveCardsStore } from './approve-cards.store';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ApproveCardsStore', () => {
  let store: any;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      getPendingCards: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ApproveCardsStore,
        { provide: ApproveCardsService, useValue: serviceMock },
      ],
    });

    store = TestBed.inject(ApproveCardsStore);
  });

  it('should initialize with default state', () => {
    expect(store.cards()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load cards and update state on success', () => {
    const mockCards = [{ id: '1', nickname: 'Test' }];
    serviceMock.getPendingCards.mockReturnValue(of(mockCards));

    store.load();

    expect(store.cards()).toEqual(mockCards);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle errors during load', () => {
    const errorResponse = new Error('Fail');
    serviceMock.getPendingCards.mockReturnValue(throwError(() => errorResponse));

    store.load();

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Fail');
    expect(store.cards()).toEqual([]);
  });
});