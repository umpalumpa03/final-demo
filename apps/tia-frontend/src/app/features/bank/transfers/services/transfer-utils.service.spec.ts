import { TestBed } from '@angular/core/testing';
import { TransferUtilsService } from './transfer-utils.service';
import { describe, it, expect, beforeEach } from 'vitest';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../models/transfers.state.model';

describe('TransferUtilsService', () => {
  let service: TransferUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferUtilsService],
    });
    service = TestBed.inject(TransferUtilsService);
  });

  describe('isSenderAccountValid', () => {
    it.each([
      {
        permission: 2,
        currency: 'GEL',
        expected: true,
        desc: 'Valid: Permission 2 with GEL',
      },
      {
        permission: 2,
        currency: 'USD',
        expected: false,
        desc: 'Invalid: Permission 2 with non-GEL',
      },
      {
        permission: 4,
        currency: 'USD',
        expected: true,
        desc: 'Valid: Permission 4 with non-GEL',
      },
      {
        permission: 4,
        currency: 'GEL',
        expected: false,
        desc: 'Invalid: Permission 4 with GEL',
      },
      {
        permission: 1,
        currency: 'GEL',
        expected: false,
        desc: 'Invalid: Unauthorized permission',
      },
    ])('$desc', ({ permission, currency, expected }) => {
      const account = { permission, currency } as Account;
      expect(service.isSenderAccountValid(account, null, true)).toBe(expected);
    });

    describe('Currency Mismatch Logic', () => {
      it('should return false if currencies mismatch and it is NOT an external IBAN', () => {
        const sender = { permission: 2, currency: 'GEL' } as Account;
        const recipient = { currency: 'USD' } as RecipientAccount;

        const result = service.isSenderAccountValid(sender, recipient, false);
        expect(result).toBe(false);
      });
    });
  });
});
