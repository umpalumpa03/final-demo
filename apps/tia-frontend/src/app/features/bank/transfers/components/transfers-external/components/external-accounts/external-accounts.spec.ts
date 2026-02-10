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
import { Router } from '@angular/router';
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
  let mockRouter: any;

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
      manualRecipientName: signal(''),
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
      getDisabledReason: vi.fn().mockReturnValue(''),
    };

    mockSelectionService = {
      handleRecipientAccountSelect: vi.fn(),
      handleSenderAccountSelect: vi.fn(),
      handleContinue: vi.fn(),
      initAutoSelectionLogic: vi.fn(),
    };

    mockBreakpointService = {
      isMobile: signal(false),
    };

    mockRouter = {
      navigate: vi.fn(),
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
        { provide: Router, useValue: mockRouter },
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

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAccounts, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectSelectedAccount, null);

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
    store.refreshState();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    store.resetSelectors();
  });

  it('should create and init auto selection logic', () => {
    expect(component).toBeTruthy();
    expect(mockSelectionService.initAutoSelectionLogic).toHaveBeenCalled();
  });

  it('should dispatch loadAccounts on init if store is empty', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should handle the verified effect correctly', async () => {
    mockStoreValues.isVerified.set(true);
    TestBed.flushEffects();
    expect(component.showSuccess()).toBe(true);
    expect(mockStoreValues.setIsVerified).toHaveBeenCalledWith(false);
    vi.advanceTimersByTime(3000);
    expect(component.showSuccess()).toBe(false);
  });

  it('should compute recipient accounts from info.accounts and sort them', () => {
    mockStoreValues.recipientInfo.set({
      accounts: [
        { id: '1', isFavorite: false },
        { id: '2', isFavorite: true },
      ],
    });
    expect(component.recipientAccounts()[0].id).toBe('2');
  });

  it('should compute fallback recipient account if only currency is provided', () => {
    mockStoreValues.recipientInfo.set({ currency: 'USD' });
    mockStoreValues.recipientInput.set('GE89IBAN');
    const accounts = component.recipientAccounts();
    expect(accounts[0].iban).toBe('GE89IBAN');
  });

  it('should calculate isContinueDisabled logic accurately', () => {
    mockStoreValues.senderAccount.set({ id: 's1' });
    mockStoreValues.recipientType.set('iban-different-bank');
    component.recipientNameInput.setValue('Test');
    expect(component.isContinueDisabled()).toBe(false);
  });

  it('should handle noPermission error effect correctly', async () => {
    mockStoreValues.error.set('transfers.external.accounts.noPermission');
    TestBed.flushEffects();
    expect(component.showError()).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(component.showError()).toBe(false);
    expect(mockStoreValues.setError).toHaveBeenCalledWith('');
  });

  it('should call handleRetryRecipientLookup on onRetry', () => {
    mockStoreValues.recipientInput.set('GE123');
    mockStoreValues.recipientType.set('internal');
    component.onRetry();
    expect(
      mockRecipientService.handleRetryRecipientLookup,
    ).toHaveBeenCalledWith('GE123', 'internal');
  });

  it('should delegate selection and continue calls', () => {
    const mockAcc = { id: 'acc1' } as any;
    component.onRecipientAccountSelect(mockAcc);
    expect(
      mockSelectionService.handleRecipientAccountSelect,
    ).toHaveBeenCalled();

    component.onSenderAccountSelect(mockAcc);
    expect(mockSelectionService.handleSenderAccountSelect).toHaveBeenCalled();

    component.onContinue();
    expect(mockSelectionService.handleContinue).toHaveBeenCalled();
  });

  it('should compute recipientName based on recipient type', () => {
    mockStoreValues.recipientType.set('iban-different-bank');
    mockStoreValues.recipientInput.set('GE00IBAN');
    expect(component.recipientName()).toBe('GE00IBAN');
  });

  it('should compute allSenderAccountsDisabled correctly', () => {
    const mockAccounts = [{ id: '1', isFavorite: false }] as any;
    store.overrideSelector(selectAccounts, mockAccounts);
    store.refreshState();
    mockRecipientService.isSenderAccountDisabled.mockReturnValue(true);
    expect(component.allSenderAccountsDisabled()).toBe(true);
  });

  it('should return disabled reason from service', () => {
    const mockAcc = { id: '1' } as any;
    component.getSenderDisabledReason(mockAcc);
    expect(mockRecipientService.getDisabledReason).toHaveBeenCalled();
  });

  it('should set manual name in ngOnInit if external iban', () => {
    mockStoreValues.recipientType.set('iban-different-bank');
    mockStoreValues.manualRecipientName.set('Saved Name');
    component.ngOnInit();
    expect(component.recipientNameInput.value).toBe('Saved Name');
  });
});
