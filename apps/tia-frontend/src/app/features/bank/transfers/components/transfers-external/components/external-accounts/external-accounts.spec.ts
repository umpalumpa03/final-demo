import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { ExternalAccounts } from './external-accounts';
import { Location } from '@angular/common';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointService } from '@tia/shared/services/breakpoints/breakpoint.service';

describe('ExternalAccounts', () => {
  let component: ExternalAccounts;
  let fixture: ComponentFixture<ExternalAccounts>;

  const mockStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    recipientInfo: signal<any>({ accounts: [] }),
    recipientInput: signal(''),
    recipientType: signal<string | null>(null),
    senderAccount: signal<any>(null),
    selectedRecipientAccount: signal<any>(null),
    isVerified: signal(false), 
    setIsVerified: vi.fn(), 
  };

  const mockExternalService = {
    isRecipientAccountDisabled: vi.fn().mockReturnValue(false),
    isSenderAccountDisabled: vi.fn().mockReturnValue(false),
    handleRecipientAccountSelect: vi.fn(),
    handleSenderAccountSelect: vi.fn(),
    handleContinue: vi.fn(),
    handleRetryRecipientLookup: vi.fn(),
  };

  const mockBreakpointService = {
    isMobile: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalAccounts, TranslateModule.forRoot()],
      providers: [
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: TransferStore, useValue: mockStore },
        { provide: BreakpointService, useValue: mockBreakpointService },
        provideMockStore({
          initialState: {
            products: {
              accounts: { accounts: [], isLoading: false, error: null },
            },
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ExternalAccounts, {
        set: {
          providers: [
            { provide: TransferExternalService, useValue: mockExternalService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
  });

  it('should create and initialize correctly', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle navigation back (Hits onGoBack)', () => {
    fixture.detectChanges();
    component.onGoBack();
    const loc = TestBed.inject(Location);
    expect(loc.back).toHaveBeenCalled();
  });

  it('should compute recipient accounts correctly (Hits computed logic)', () => {
    mockStore.recipientInfo.set({ accounts: [{ id: 'acc1' }] });
    fixture.detectChanges();
    expect(component.recipientAccounts().length).toBe(1);
  });

  it('should handle IBAN fallback in recipientAccounts (Hits computed branch)', () => {
    mockStore.recipientInfo.set({ currency: 'GEL', accounts: null });
    mockStore.recipientInput.set('GE123');
    fixture.detectChanges();

    const accounts = component.recipientAccounts();
    expect(accounts[0].iban).toBe('GE123');
    expect(accounts[0].currency).toBe('GEL');
  });

  it('should call handleContinue with form values', () => {
    fixture.detectChanges();
    component.recipientNameInput.setValue('Giorgi');
    component.onContinue();

    expect(mockExternalService.handleContinue).toHaveBeenCalledWith(
      null,
      null,
      expect.any(Boolean),
      'Giorgi',
    );
  });

  it('should call service methods on account selection', () => {
    const mockAcc = { id: '1' } as any;
    fixture.detectChanges();

    component.onRecipientAccountSelect(mockAcc);
    expect(mockExternalService.handleRecipientAccountSelect).toHaveBeenCalled();

    component.onSenderAccountSelect(mockAcc);
    expect(mockExternalService.handleSenderAccountSelect).toHaveBeenCalled();
  });

  it('should call handleRetryRecipientLookup (Hits onRetry)', () => {
    fixture.detectChanges();
    component.onRetry();
    expect(mockExternalService.handleRetryRecipientLookup).toHaveBeenCalled();
  });
});
