import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { InternalToAccount } from '../components/internal-to-account/internal-to-account';
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
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountType } from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'u1',
    permission: 1,
    type: AccountType.current,
    iban: 'GE00XX0000000000000001',
    friendlyName: 'Sender',
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
    friendlyName: 'Recipient',
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

describe('InternalToAccount Integration', () => {
  let component: InternalToAccount;
  let fixture: ComponentFixture<InternalToAccount>;
  let store: MockStore;
  let router: Router;
  let transferStore: InstanceType<typeof TransferStore>;
  let alertService: { error: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    alertService = { error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [InternalToAccount, TranslateModule.forRoot()],
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
        { provide: AlertService, useValue: alertService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    transferStore = TestBed.inject(TransferStore);
    fixture = TestBed.createComponent(InternalToAccount);
    component = fixture.componentInstance;
    // Set sender so we have transferable accounts and can test to-account selection
    transferStore.setSenderAccount(mockAccounts[0]);
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

  it('should show sender card and transferable accounts (excluding sender)', () => {
    expect(fixture.nativeElement.textContent).toContain('Sender');
    expect(fixture.nativeElement.textContent).toContain('transfers.internal.step-1');
    const cards = fixture.debugElement.queryAll(By.css('app-transfers-account-card'));
    expect(component.transferableAccounts().length).toBe(1);
    expect(component.transferableAccounts()[0].id).toBe('acc-2');
  });

  it('should select recipient and enable continue', () => {
    expect(component.isContinueDisabled()).toBe(true);
    component.onAccountSelect(mockAccounts[1] as any);
    fixture.detectChanges();
    expect(transferStore.receiverOwnAccount()).toEqual(mockAccounts[1]);
    expect(component.isContinueDisabled()).toBe(false);
  });

  it('should navigate to amount on continue when recipient selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    transferStore.setReceiverOwnAccount(mockAccounts[1]);
    fixture.detectChanges();
    component.onContinue();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal/amount']);
  });

  it('should navigate to from-account on go back', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onGoBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal/from-account']);
  });

  it('should swap sender and recipient on swap', () => {
    transferStore.setSenderAccount(mockAccounts[0]);
    transferStore.setReceiverOwnAccount(mockAccounts[1]);
    fixture.detectChanges();
    component.onSwapAccounts();
    expect(transferStore.senderAccount()).toEqual(mockAccounts[1]);
    expect(transferStore.receiverOwnAccount()).toEqual(mockAccounts[0]);
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
    store.overrideSelector(selectError, 'Error');
    store.overrideSelector(selectAccounts, []);
    store.refreshState();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-error-states'))).toBeTruthy();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onRetry();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should return last four digits of iban', () => {
    expect(component.getLastFourDigits('GE00XX0000000000000001')).toBe('0001');
  });
});
