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
});
