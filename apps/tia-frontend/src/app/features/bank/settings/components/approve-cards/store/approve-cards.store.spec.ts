import { TestBed } from '@angular/core/testing';
import { ApproveCardsStore } from './approve-cards.store';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError, EMPTY } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { patchState } from '@ngrx/signals';

describe('ApproveCardsStore Full Coverage', () => {
  let store: any;
  let serviceMock: any;
  let alertServiceMock: any;

  beforeEach(() => {
    serviceMock = {
      getPendingCards: vi.fn(),
      changeCardStatus: vi.fn(),
      getCardPermissions: vi.fn(),
    };

    alertServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        ApproveCardsStore,
        provideMockStore({}),
        { provide: ApproveCardsService, useValue: serviceMock },
        { provide: AlertService, useValue: alertServiceMock },
        TranslateService,
      ],
    });

    store = TestBed.inject(ApproveCardsStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle load() success and update state', () => {
    const mockCards = [{ id: '1', nickname: 'Visa' }];
    serviceMock.getPendingCards.mockReturnValue(of(mockCards));

    store.load();

    expect(store.cards()).toEqual(mockCards);
    expect(store.isLoading()).toBe(false);
    expect(store.count()).toBe(1); // ფარავს withComputed
  });

  it('should handle load() error branch and return empty array', () => {
    serviceMock.getPendingCards.mockReturnValue(throwError(() => ({ message: 'Load Error' })));
    
    store.load();

    expect(store.error()).toBe('Load Error');
    expect(store.cards()).toEqual([]);
  });

  it('should handle updateStatus() success and filter cards', () => {
    const initialCards = [{ id: 'c1' }, { id: 'c2' }];
    patchState(store, { cards: initialCards as any });
    serviceMock.changeCardStatus.mockReturnValue(of({}));
    
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Success Message');

    store.updateStatus({ cardId: 'c1', status: 'ACTIVE', permissions: [] });

    expect(store.cards().length).toBe(1);
    expect(store.cards()[0].id).toBe('c2');
    
    expect(alertServiceMock.success).toHaveBeenCalledWith('Success Message', expect.any(Object));
  });

  it('should handle updateStatus() error and show error alert', () => {
    serviceMock.changeCardStatus.mockReturnValue(throwError(() => ({ message: 'Update Fail' })));
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Error Message');

    store.updateStatus({ cardId: '1', status: 'ACTIVE', permissions: [] });

    expect(store.error()).toBe('Update Fail');
    expect(alertServiceMock.error).toHaveBeenCalledWith('Error Message', expect.any(Object));
    expect(store.isLoading()).toBe(false);
  });

  it('should load permissions when cache is empty', () => {
    const mockPerms = [{ value: 'atm', displayName: 'ATM' }];
    serviceMock.getCardPermissions.mockReturnValue(of(mockPerms));
    patchState(store, { permissions: [] });

    store.loadPerrmisions();

    expect(serviceMock.getCardPermissions).toHaveBeenCalled();
    expect(store.permissions()).toEqual(mockPerms);
  });

  it('should return EMPTY and not call API if permissions exist', () => {
    patchState(store, { permissions: [{ value: 'web' }] as any });
    
    store.loadPerrmisions();

    expect(serviceMock.getCardPermissions).not.toHaveBeenCalled();
  });

  it('should handle loadPerrmisions() API error', () => {
    patchState(store, { permissions: [] });
    serviceMock.getCardPermissions.mockReturnValue(throwError(() => ({ message: 'Perm Error' })));

    store.loadPerrmisions();

    expect(store.error()).toBe('Perm Error');
    expect(store.isLoading()).toBe(false);
  });
});