import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAccounts } from './external-accounts';
import { Location } from '@angular/common';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferRecipientService } from '../../services/transfer-recipient.service';
import { TransferAccountSelectionService } from '../../services/transfer-account-selection.service';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  selectSelectedAccount,
  selectAccounts,
  selectIsLoading,
  selectError,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';

describe('ExternalAccounts', () => {
  let component: ExternalAccounts;
  let fixture: ComponentFixture<ExternalAccounts>;
  let store: MockStore;

  let mockStoreValues: any;
  let mockRecipientService: any;
  let mockSelectionService: any;
  let mockBreakpointService: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    mockStoreValues = {
      isLoading: signal(false),
      error: signal<string | null>(null),
      recipientInfo: signal<any>(null),
      recipientInput: signal(''),
      recipientType: signal<string | null>(null),
      senderAccount: signal<any>(null),
      selectedRecipientAccount: signal<any>(null),
      isVerified: signal(false),
      setIsVerified: vi.fn(),
      setError: vi.fn((val: string) => mockStoreValues.error.set(val)),
      setSelectedRecipientAccount: vi.fn((val: any) =>
        mockStoreValues.selectedRecipientAccount.set(val),
      ),
      setSenderAccount: vi.fn((val: any) =>
        mockStoreValues.senderAccount.set(val),
      ),
    };

    mockRecipientService = {
      isRecipientAccountDisabled: vi.fn().mockReturnValue(false),
      isSenderAccountDisabled: vi.fn().mockReturnValue(false),
      handleRetryRecipientLookup: vi.fn(),
    };

    mockSelectionService = {
      handleRecipientAccountSelect: vi.fn(),
      handleSenderAccountSelect: vi.fn(),
      handleContinue: vi.fn(),
    };

    mockBreakpointService = {
      isMobile: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExternalAccounts,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: TransferStore, useValue: mockStoreValues },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: TransferRecipientService, useValue: mockRecipientService },
        {
          provide: TransferAccountSelectionService,
          useValue: mockSelectionService,
        },
        provideMockStore({
          initialState: {
            accounts: { accounts: [], isLoading: false, error: null },
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectAccounts, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectSelectedAccount, null);

    store.refreshState();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    store.resetSelectors();
  });

  it('should dispatch loadAccounts on init if store is empty', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should handle the verified effect correctly', async () => {
    fixture.detectChanges();
    mockStoreValues.isVerified.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    expect(component.showSuccess()).toBe(true);
    expect(mockStoreValues.setIsVerified).toHaveBeenCalledWith(false);
    vi.advanceTimersByTime(3000);
    expect(component.showSuccess()).toBe(false);
  });

  it('should compute recipient accounts from info.accounts', () => {
    mockStoreValues.recipientInfo.set({
      accounts: [{ id: '1', currency: 'GEL' }],
    });
    fixture.detectChanges();
    expect(component.recipientAccounts().length).toBe(1);
  });

  it('should compute fallback recipient account if only currency is provided', () => {
    mockStoreValues.recipientInfo.set({ currency: 'USD' });
    mockStoreValues.recipientInput.set('GE89IBAN');
    fixture.detectChanges();
    const accounts = component.recipientAccounts();
    expect(accounts[0].iban).toBe('GE89IBAN');
    expect(accounts[0].currency).toBe('USD');
  });

  it('should calculate isContinueDisabled logic accurately', () => {
    mockStoreValues.senderAccount.set(null);
    fixture.detectChanges();
    expect(component.isContinueDisabled()).toBe(true);
    mockStoreValues.recipientType.set('iban-different-bank');
    mockStoreValues.senderAccount.set({ id: 's1' });
    component.recipientNameInput.setValue('');
    fixture.detectChanges();
    expect(component.isContinueDisabled()).toBe(true);
    component.recipientNameInput.setValue('Giorgi');
    fixture.detectChanges();
    expect(component.isContinueDisabled()).toBe(false);
  });

  it('should delegate selection to handleRecipientAccountSelect', () => {
    const mockAcc = { id: 'acc1' } as any;
    component.onRecipientAccountSelect(mockAcc);
    expect(
      mockSelectionService.handleRecipientAccountSelect,
    ).toHaveBeenCalled();
  });

  it('should trigger handleContinue on continue action', () => {
    component.recipientNameInput.setValue('Lasha');
    component.onContinue();
    expect(mockSelectionService.handleContinue).toHaveBeenCalledWith(
      component.selectedRecipientAccount(),
      component.selectedSenderAccount(),
      component.isExternalIban(),
      'Lasha',
    );
  });

  it('should call location back on onGoBack', () => {
    const loc = TestBed.inject(Location);
    component.onGoBack();
    expect(loc.back).toHaveBeenCalled();
  });

  it('should handle noPermission error effect correctly', async () => {
    fixture.detectChanges();
    mockStoreValues.error.set('transfers.external.accounts.noPermission');
    fixture.detectChanges();
    await Promise.resolve();
    expect(component.showError()).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(component.showError()).toBe(false);
    expect(mockStoreValues.setError).toHaveBeenCalledWith('');
  });

  it('should handle currency mismatch effect correctly', async () => {
    fixture.detectChanges();
    component.currencyMismatchError.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    vi.advanceTimersByTime(5000);
    expect(component.currencyMismatchError()).toBe(false);
  });

  it('should call handleRetryRecipientLookup on onRetry', () => {
    mockStoreValues.recipientInput.set('GE123');
    mockStoreValues.recipientType.set('internal');
    component.onRetry();
    expect(
      mockRecipientService.handleRetryRecipientLookup,
    ).toHaveBeenCalledWith('GE123', 'internal');
  });

  it('should dispatch loadAccounts on onRetrySenderAccounts', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onRetrySenderAccounts();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should call recipientService for account disabled states', () => {
    const mockAcc = { id: '1' } as any;
    component.isRecipientAccountDisabled(mockAcc);
    expect(mockRecipientService.isRecipientAccountDisabled).toHaveBeenCalled();
    component.isSenderAccountDisabled(mockAcc);
    expect(mockRecipientService.isSenderAccountDisabled).toHaveBeenCalled();
  });

  it('should delegate selection to handleSenderAccountSelect', () => {
    const mockAcc = { id: 's1' } as any;
    component.onSenderAccountSelect(mockAcc);
    expect(mockSelectionService.handleSenderAccountSelect).toHaveBeenCalled();
  });

  it('should compute recipientName based on recipient type', () => {
    mockStoreValues.recipientType.set('iban-different-bank');
    mockStoreValues.recipientInput.set('GE00IBAN');
    fixture.detectChanges();
    expect(component.recipientName()).toBe('GE00IBAN');
    mockStoreValues.recipientType.set('internal');
    mockStoreValues.recipientInfo.set({ fullName: 'Tia User' });
    fixture.detectChanges();
    expect(component.recipientName()).toBe('Tia User');
  });


  it('should auto-select favorite recipient account', async () => {
    const favoriteRecipient = { id: 'r1', isFavorite: true };
    mockStoreValues.recipientInfo.set({ accounts: [favoriteRecipient] });
    mockStoreValues.selectedRecipientAccount.set(null);
    mockStoreValues.recipientType.set('internal');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockStoreValues.setSelectedRecipientAccount).toHaveBeenCalledWith(
      favoriteRecipient,
    );
  });

  it('should sort sender accounts by favorite status', () => {
    const mockAccounts = [
      { id: '1', isFavorite: false },
      { id: '2', isFavorite: true },
    ] as any;

    store.overrideSelector(selectAccounts, mockAccounts);
    store.refreshState();
    fixture.detectChanges();

    const result = component.senderAccounts();
    expect(result[0].id).toBe('2');
  });
});
