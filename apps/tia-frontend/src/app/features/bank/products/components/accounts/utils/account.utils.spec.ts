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

  it('should return correct icons for all account types', () => {
    expect(service.getAccountIcon(AccountType.current)).toBe(
      '/images/svg/account/wallet.svg',
    );
    expect(service.getAccountIcon(AccountType.saving)).toBe(
      '/images/svg/account/piggy-bank.svg',
    );
    expect(service.getAccountIcon(AccountType.card)).toBe(
      '/images/svg/account/building.svg',
    );
  });

  it('should return default icon for unknown account type', () => {
    const icon = service.getAccountIcon('unknown' as AccountType);
    expect(icon).toBe('/images/svg/account/wallet.svg');
  });
});
