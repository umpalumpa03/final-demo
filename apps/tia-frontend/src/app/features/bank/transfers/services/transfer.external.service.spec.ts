import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferExternalService } from './transfer.external.service';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { RecipientAccount } from '../models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';

describe('TransferExternalService', () => {
  let service: TransferExternalService;
  let mockRouter: any;
  let mockStore: any;
  let mockValidationService: any;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };
    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal(null),
      setExternalRecipient: vi.fn(),
      lookupRecipient: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setManualRecipientName: vi.fn(),
    };
    mockValidationService = {
      identifyRecipientType: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferExternalService,
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferValidationService, useValue: mockValidationService },
      ],
    });

    service = TestBed.inject(TransferExternalService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate if data already exists', () => {
    mockStore.recipientInput.set('20202020');
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ fullName: 'Test' });
    mockValidationService.identifyRecipientType.mockReturnValue('phone');

    service.verifyRecipient('20202020');

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should set external recipient and navigate for external iban', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-different-bank',
    );

    service.verifyRecipient('DE89370400440532013000');

    expect(mockStore.setExternalRecipient).toHaveBeenCalledWith(
      'DE89370400440532013000',
      'iban-different-bank',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should call lookup for phone type', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');

    service.verifyRecipient('20202020');

    expect(mockStore.lookupRecipient).toHaveBeenCalledWith({
      value: '20202020',
      type: 'phone',
    });
  });

  it('should disable recipient account if sender currency does not match', () => {
    const recipientAccount = {
      id: '1',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;
    const senderAccount = { id: '2', currency: 'USD' } as Account;

    const result = service.isRecipientAccountDisabled(
      recipientAccount,
      senderAccount,
    );

    expect(result).toBe(true);
  });

  it('should not disable recipient account if no sender selected', () => {
    const recipientAccount = {
      id: '1',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    const result = service.isRecipientAccountDisabled(recipientAccount, null);

    expect(result).toBe(false);
  });

  it('should not disable sender account for external iban', () => {
    const senderAccount = { id: '1', currency: 'USD' } as Account;
    const recipientAccount = {
      id: '2',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    const result = service.isSenderAccountDisabled(
      senderAccount,
      recipientAccount,
      true,
    );

    expect(result).toBe(false);
  });

  it('should disable sender account if recipient currency does not match', () => {
    const senderAccount = { id: '1', currency: 'USD' } as Account;
    const recipientAccount = {
      id: '2',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    const result = service.isSenderAccountDisabled(
      senderAccount,
      recipientAccount,
      false,
    );

    expect(result).toBe(true);
  });

  it('should toggle recipient account selection', () => {
    const account = {
      id: '1',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    service.handleRecipientAccountSelect(account, account);

    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);
  });

  it('should select recipient account if different', () => {
    const account = {
      id: '1',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    service.handleRecipientAccountSelect(account, null);

    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(account);
  });

  it('should toggle sender account selection', () => {
    const account = { id: '1', currency: 'GEL' } as Account;

    service.handleSenderAccountSelect(account, account);

    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
  });

  it('should navigate on continue with recipient account', () => {
    const recipientAccount = {
      id: '1',
      iban: 'GE123',
      currency: 'GEL',
    } as RecipientAccount;

    service.handleContinue(recipientAccount, null, false, null);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should save manual name for external iban', () => {
    service.handleContinue(null, null, true, 'John Doe');

    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('John Doe');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });
});
