import { TestBed } from '@angular/core/testing';
import { ApproveCardsStore } from './approve-cards.store';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError, delay } from 'rxjs';
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
    expect(store.count()).toBe(1); 
  });

  it('should skip load() if cards already exist (Lazy Loading)', () => {
    patchState(store, { cards: [{ id: 'c1' }] as any });
    
    store.load();

    expect(serviceMock.getPendingCards).not.toHaveBeenCalled();
    expect(store.isLoading()).toBe(false);
  });

  it('should handle load() error branch and update error state', () => {
    serviceMock.getPendingCards.mockReturnValue(throwError(() => ({ message: 'Load Error' })));
    
    store.load();

    expect(store.error()).toBe('Load Error');
    expect(store.cards()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('should set isLoading to true when starting updateStatus', () => {
    serviceMock.changeCardStatus.mockReturnValue(of({}).pipe(delay(10)));
    
    store.updateStatus({ cardId: 'c1', status: 'ACTIVE', permissions: [] });
    
    expect(store.isLoading()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('should handle updateStatus() success, filter cards and show success alert', () => {
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

  it('should load permissions when cache is empty and update loading states', () => {
    const mockPerms = [{ value: 'atm', displayName: 'ATM' }];
    serviceMock.getCardPermissions.mockReturnValue(of(mockPerms));
    patchState(store, { permissions: [] });

    store.loadPermissions();

    expect(serviceMock.getCardPermissions).toHaveBeenCalled();
    expect(store.permissions()).toEqual(mockPerms);
    expect(store.isPermissionsLoading()).toBe(false);
  });

  it('should return EMPTY and not call API if permissions exist', () => {
    patchState(store, { permissions: [{ value: 'web' }] as any });
    
    store.loadPermissions();

    expect(serviceMock.getCardPermissions).not.toHaveBeenCalled();
    expect(store.isPermissionsLoading()).toBe(false);
  });

  it('should handle loadPermissions() API error and stop loading', () => {
    patchState(store, { permissions: [] });
    serviceMock.getCardPermissions.mockReturnValue(throwError(() => ({ message: 'Perm Error' })));

    store.loadPermissions();

    expect(store.error()).toBe('Perm Error');
    expect(store.isPermissionsLoading()).toBe(false);
  });

  it('should clear all data when clearCache is called', () => {
    patchState(store, { 
      cards: [{ id: '1' }] as any, 
      permissions: [{ value: 'p1' }] as any,
      error: 'some error',
      isLoading: true
    });

    store.clearCache();

    expect(store.cards()).toEqual([]);
    expect(store.permissions()).toEqual([]);
    expect(store.error()).toBeNull();
  });
});