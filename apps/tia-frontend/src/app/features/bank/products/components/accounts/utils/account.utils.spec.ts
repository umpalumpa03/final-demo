import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountUtils } from './account.utils';
import { AccountType } from '../../../../../../shared/models/accounts/accounts.model';

describe('AccountUtils', () => {
  let service: AccountUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountUtils],
    });
    service = TestBed.inject(AccountUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return wallet icon for current account type', () => {
    const icon = service.getAccountIcon(AccountType.current);
    expect(icon).toBe('/images/svg/account/wallet.svg');
  });

  it('should return piggy-bank icon for saving account type', () => {
    const icon = service.getAccountIcon(AccountType.saving);
    expect(icon).toBe('/images/svg/account/piggy-bank.svg');
  });

  it('should return building icon for card account type', () => {
    const icon = service.getAccountIcon(AccountType.card);
    expect(icon).toBe('/images/svg/account/building.svg');
  });

  it('should return default icon for unknown account type', () => {
    const icon = service.getAccountIcon('unknown' as AccountType);
    expect(icon).toBe('/images/svg/account/wallet.svg');
  });
});
