import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetAccounts } from './widget-accounts';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { selectDashboardAccountsWithTrendline } from '../../selectors/dashboard-accounts.selectors';
import { AccountWithTrendline } from '../../models/account-trendline.models';
import { AccountType } from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

const mockAccountNoTrendline: AccountWithTrendline = {
  id: 'acc-1',
  userId: 'u1',
  permission: 1,
  type: AccountType.current,
  iban: 'GE00XX0000000000000001',
  friendlyName: 'Current',
  name: 'Current Account',
  status: 'active',
  balance: 100,
  currency: 'GEL',
  createdAt: '2026-01-01',
  openedAt: '2026-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
  lastTransaction: null,
  trendline: null,
};

const mockAccountWithTrendline: AccountWithTrendline = {
  ...mockAccountNoTrendline,
  id: 'acc-2',
  iban: 'GE00XX0000000000000002',
  balance: 200,
  trendline: { direction: 'up', amount: 50, type: 'credit' },
  lastTransaction: {} as any,
};

describe('WidgetAccounts', () => {
  let component: WidgetAccounts;
  let fixture: ComponentFixture<WidgetAccounts>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetAccounts, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);

    fixture = TestBed.createComponent(WidgetAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadAccounts on retryLoad', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.retryLoad();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.loadAccounts({ enrichWithTransactions: true }),
    );
  });

  it('should return 0 from getAnimatedBalance when balance not set', () => {
    expect(component.getAnimatedBalance('unknown-id')).toBe(0);
  });

  it('should return animated balance from getAnimatedBalance when set', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      mockAccountNoTrendline,
    ]);
    store.refreshState();
    fixture.detectChanges();
    expect(component.getAnimatedBalance('acc-1')).toBe(100);
  });

  it('should return asterisks from formatAsAsterisks', () => {
    expect(component.formatAsAsterisks(123.45)).toBe('******');
  });

  it('should show accounts when store has accounts', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      mockAccountNoTrendline,
    ]);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Current');
    expect(el.textContent).toContain('****0001');
  });

  it('should show loader when loading', () => {
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-route-loader')).toBeTruthy();
  });

  it('should show error state when error and not loading', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, 'Something failed');
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-error-states')).toBeTruthy();
    expect(el.textContent).toContain('dashboard.widgets.accounts.error.header');
  });

  it('should show empty state when no accounts', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('dashboard.widgets.accounts.empty.header');
  });

  it('should render trendline when account has trendline', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      mockAccountWithTrendline,
    ]);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.account-card__trendline')).toBeTruthy();
  });

  it('should render account with friendlyName when set', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      { ...mockAccountNoTrendline, friendlyName: 'My Account' },
    ]);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('My Account');
  });

  it('should render account name when friendlyName is empty', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      { ...mockAccountNoTrendline, friendlyName: null },
    ]);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Current Account');
  });

  it('should animate balance when account has trendline', () => {
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: (time: number) => void) => {
        // Run with elapsed >= duration so animation completes in one frame
        cb(performance.now() + 1500);
        return 1;
      }
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    store.overrideSelector(selectDashboardAccountsWithTrendline, [
      mockAccountWithTrendline,
    ]);
    store.refreshState();
    fixture.detectChanges();

    expect(component.getAnimatedBalance('acc-2')).toBe(200);
    vi.unstubAllGlobals();
  });
});
