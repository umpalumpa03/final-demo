import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { WidgetAccounts } from '../../widget-accounts/widget-accounts';
import {
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { selectDashboardAccountsWithTrendline } from '../../../selectors/dashboard-accounts.selectors';
import { AccountWithTrendline } from '../../../models/account-trendline.models';
import { AccountType } from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

const mockAccount: AccountWithTrendline = {
  id: 'acc-1',
  userId: 'u1',
  permission: 1,
  type: AccountType.current,
  iban: 'GE00XX0000000000000001',
  friendlyName: 'My Current',
  name: 'Current Account',
  status: 'active',
  balance: 150.5,
  currency: 'GEL',
  createdAt: '2026-01-01',
  openedAt: '2026-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
  lastTransaction: null,
  trendline: null,
};

describe('WidgetAccounts Integration', () => {
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

  it('should render account list when store has accounts', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [mockAccount]);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.account-card'));
    expect(cards.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('My Current');
    expect(fixture.nativeElement.textContent).toContain('****0001');
    expect(fixture.nativeElement.textContent).toContain('150.50');
  });

  it('should show loader when loading', () => {
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-route-loader'))).toBeTruthy();
  });

  it('should show error state and retry dispatches loadAccounts', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, 'Network error');
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-error-states'))).toBeTruthy();

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.retryLoad();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.loadAccounts({ enrichWithTransactions: true }),
    );
  });

  it('should show empty state when no accounts', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectDashboardAccountsWithTrendline, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'dashboard.widgets.accounts.empty.header',
    );
  });

  it('should hide balances when balancesHidden input is true', () => {
    store.overrideSelector(selectDashboardAccountsWithTrendline, [mockAccount]);
    store.refreshState();
    fixture.componentRef.setInput('balancesHidden', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('******');
  });
});
