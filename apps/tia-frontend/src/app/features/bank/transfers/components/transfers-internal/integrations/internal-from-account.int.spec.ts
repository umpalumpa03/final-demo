import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { InternalFromAccount } from '../components/internal-from-account/internal-from-account';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransferStore } from '../../../store/transfers.store';
import { TransferInternalService } from '../services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountType } from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'u1',
    permission: 1,
    type: AccountType.current,
    iban: 'GE00XX0000000000000001',
    friendlyName: 'Main',
    name: 'Current Account',
    status: 'active',
    balance: 1000,
    currency: 'GEL',
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: true,
    isHidden: false,
  },
  {
    id: 'acc-2',
    userId: 'u1',
    permission: 1,
    type: AccountType.saving,
    iban: 'GE00XX0000000000000002',
    friendlyName: null,
    name: 'Saving Account',
    status: 'active',
    balance: 500,
    currency: 'GEL',
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  },
];

describe('InternalFromAccount Integration', () => {
  let component: InternalFromAccount;
  let fixture: ComponentFixture<InternalFromAccount>;
  let store: MockStore;
  let router: Router;
  let transferStore: InstanceType<typeof TransferStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalFromAccount, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAccounts, value: mockAccounts },
            { selector: selectIsLoading, value: false },
            { selector: selectError, value: null },
          ],
        }),
        TransferStore,
        TransferInternalService,
        {
          provide: Router,
          useValue: { navigate: vi.fn(), events: of() },
        },
        {
          provide: BreakpointService,
          useValue: { isMobile: signal(false) },
        },
        {
          provide: TransfersApiService,
          useValue: { lookupByPhone: vi.fn(), lookupByIban: vi.fn() },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    transferStore = TestBed.inject(TransferStore);
    transferStore.setSenderAccount(null);
    fixture = TestBed.createComponent(InternalFromAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadAccounts on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should render header and accounts section', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.accounts.title',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.accounts.selectSenderAccount',
    );
  });

  it('should show account cards when accounts are loaded', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-transfers-account-card'));
    expect(cards.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Main');
    expect(fixture.nativeElement.textContent).toContain('Saving Account');
  });

  it('should have continue button in footer', () => {
    const continueBtn = fixture.debugElement.query(
      By.css('.internal-accounts__footer app-button[variant="default"]'),
    );
    expect(continueBtn).toBeTruthy();
  });

  it('should select account and enable continue when account is selected', () => {
    component.onAccountSelect(mockAccounts[0] as any);
    fixture.detectChanges();
    expect(transferStore.senderAccount()).toEqual(mockAccounts[0]);
    expect(component.isContinueDisabled()).toBe(false);
  });

  it('should navigate to to-account on continue when account selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    transferStore.setSenderAccount(mockAccounts[0]);
    fixture.detectChanges();
    component.onContinue();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal/to-account']);
  });

  it('should show loader when loading', () => {
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectAccounts, []);
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-route-loader'))).toBeTruthy();
  });

  it('should show error state and dispatch loadAccounts on retry', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, 'Network error');
    store.overrideSelector(selectAccounts, []);
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-error-states'))).toBeTruthy();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onRetry();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should show empty state when no accounts', () => {
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectAccounts, []);
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.accounts.noSenderAccounts.header',
    );
  });
});
