import { TestBed } from '@angular/core/testing';
// Mock the accounts.state module so the real AccountsStore can be imported safely
vi.mock('../store/accounts.state', () => ({
  initialState: {
    accounts: null,
    loading: false,
    loaded: false,
    error: null,
    favoriteLoadingIds: new Set(),
    visibilityLoadingIds: new Set(),
    changeNameLoadingIds: new Set(),
    successMessage: null,
  },
}));
import { AccountManagementService } from '../services/account-management.service';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { AccountType } from '@tia/shared/models/accounts/accounts.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AccountsStore } from '../store/accounts.store';

describe('AccountsStore', () => {
  let store: any;
  let mockService: any;
  let mockGlobalStore: any;
  let mockTranslate: any;
  let mockAlertService: any;

  beforeEach(() => {
    mockService = {
      getAllAccounts: vi.fn().mockReturnValue(of([])),
      markAccountFavoriteStatus: vi.fn().mockReturnValue(of({})),
      updateAccountVisibility: vi.fn().mockReturnValue(of({})),
      updateAccountFriendlyName: vi.fn().mockReturnValue(of({})),
    };
    mockGlobalStore = { dispatch: vi.fn() };
    mockTranslate = { instant: vi.fn().mockImplementation((k: any) => k) };
    mockAlertService = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        AccountsStore,
        { provide: AccountManagementService, useValue: mockService },
        { provide: Store, useValue: mockGlobalStore },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: AlertService, useValue: mockAlertService },
      ],
    });
    store = TestBed.inject(AccountsStore) as any;
  });

  it('store should expose resetStore method', () => {
    expect(typeof store.resetStore).toBe('function');
  });

  it('should call service.getAllAccounts when loadAccounts invoked', async () => {
    // call the rxMethod; it may run asynchronously so await a microtask
    store.loadAccounts();
    await Promise.resolve();
    expect(mockService.getAllAccounts).toHaveBeenCalled();
  });

  it('toggleFavorite updates account and clears loading id', async () => {
    const sample = [{
      id: 'a1',
      type: 'CURRENT' as AccountType,
      currency: 'USD',
      iban: 'IBAN1',
      name: 'Account',
      balance: '0',
      friendlyName: 'Old',
      isHidden: false,
      order: null,
      isFavorite: false,
    }];
    patchState(store, { accounts: sample });
    store.toggleFavorite({ id: 'a1', isFavorite: false });
    await Promise.resolve();
    const updated = store.accounts()?.find((a: any) => a.id === 'a1');
    expect(updated?.isFavorite).toBe(true);
    expect(mockGlobalStore.dispatch).toHaveBeenCalled();
  });

  it('toggleVisibility updates visibility and clears favorite when hidden', async () => {
    const sample = [{
      id: 'a2',
      type: 'CURRENT' as AccountType,
      currency: 'USD',
      iban: 'IBAN2',
      name: 'Account2',
      balance: '0',
      friendlyName: 'Old2',
      isHidden: false,
      order: null,
      isFavorite: true,
    }];
    patchState(store, { accounts: sample });
    store.toggleVisibility({ id: 'a2', isHidden: false });
    await Promise.resolve();
    const updated = store.accounts()?.find((a: any) => a.id === 'a2');
    expect(updated?.isHidden).toBe(true);
    expect(updated?.isFavorite).toBe(false);
    expect(mockGlobalStore.dispatch).toHaveBeenCalled();
  });

  it('changeFriendlyName updates account friendlyName', async () => {
    const sample = [{
      id: 'a3',
      type: 'CURRENT' as AccountType,
      currency: 'USD',
      iban: 'IBAN3',
      name: 'Account3',
      balance: '0',
      friendlyName: 'Old3',
      isHidden: false,
      order: null,
      isFavorite: false,
    }];
    patchState(store, { accounts: sample });
    store.changeFriendlyName({ id: 'a3', friendlyName: 'New3' });
    await Promise.resolve();
    const updated = store.accounts()?.find((a: any) => a.id === 'a3');
    expect(updated?.friendlyName).toBe('New3');
    expect(mockGlobalStore.dispatch).toHaveBeenCalled();
  });

  it('loadAccounts sets error on failure', async () => {
    mockService.getAllAccounts = vi.fn().mockReturnValue(throwError(() => new Error('fail')));
    store.loadAccounts();
    await Promise.resolve();
    expect(store.error()).toBe('Failed to load accounts');
    expect(store.accounts()).toEqual([]);
  });

  it('toggleFavorite sets error and clears loading id on failure', async () => {
    const sample = [{ id: 'f1', type: 'CURRENT' as AccountType, currency: 'USD', iban: 'I', name: 'N', balance: '0', friendlyName: 'F', isHidden: false, order: null, isFavorite: false }];
    patchState(store, { accounts: sample });
    mockService.markAccountFavoriteStatus = vi.fn().mockReturnValue(throwError(() => new Error('err')));
    store.toggleFavorite({ id: 'f1', isFavorite: false });
    await Promise.resolve();
    expect(store.error()).toBeNull();
    expect(mockAlertService.error).toHaveBeenCalled();
    expect(store.favoriteLoadingIds().has('f1')).toBeFalsy();
  });

  it('toggleVisibility sets error and clears loading id on failure', async () => {
    const sample = [{ id: 'v1', type: 'CURRENT' as AccountType, currency: 'USD', iban: 'I2', name: 'N2', balance: '0', friendlyName: 'F2', isHidden: false, order: null, isFavorite: true }];
    patchState(store, { accounts: sample });
    mockService.updateAccountVisibility = vi.fn().mockReturnValue(throwError(() => new Error('err')));
    store.toggleVisibility({ id: 'v1', isHidden: false });
    await Promise.resolve();
    expect(store.error()).toBeNull();
    expect(mockAlertService.error).toHaveBeenCalled();
    expect(store.visibilityLoadingIds().has('v1')).toBeFalsy();
  });

  it('changeFriendlyName sets error and clears loading id on failure', async () => {
    const sample = [{ id: 'c1', type: 'CURRENT' as AccountType, currency: 'USD', iban: 'I3', name: 'N3', balance: '0', friendlyName: 'Old', isHidden: false, order: null, isFavorite: false }];
    patchState(store, { accounts: sample });
    mockService.updateAccountFriendlyName = vi.fn().mockReturnValue(throwError(() => new Error('err')));
    store.changeFriendlyName({ id: 'c1', friendlyName: 'New' });
    await Promise.resolve();
    expect(store.error()).toBeNull();
    expect(mockAlertService.error).toHaveBeenCalled();
    expect(store.changeNameLoadingIds().has('c1')).toBeFalsy();
  });
});
