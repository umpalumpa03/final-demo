import { AccountUtils } from '@tia/shared/utils/accounts-icons/account.utils';
import { TranslateService } from '@ngx-translate/core';
import {
  AccountSection,
  AccountType,
  CreateAccountConfig,
} from '@tia/shared/models/accounts/accounts.model';

const accountUtils = new AccountUtils();

export const getAccountSections = (
  translate: TranslateService,
): AccountSection[] =>
  [
    {
      key: AccountType.current,
      title: translate.instant('my-products.accounts.sections.current'),
      icon: accountUtils.getAccountIcon(AccountType.current),
    },
    {
      key: AccountType.saving,
      title: translate.instant('my-products.accounts.sections.savings'),
      icon: accountUtils.getAccountIcon(AccountType.saving),
    },
    {
      key: AccountType.card,
      title: translate.instant('my-products.accounts.sections.cards'),
      icon: accountUtils.getAccountIcon(AccountType.card),
    },
  ] as const;

export const getCreateAccountConfig = (
  translate: TranslateService,
): CreateAccountConfig =>
  ({
    friendlyName: {
      label: translate.instant('my-products.accounts.form.friendlyName.label'),
      placeholder: translate.instant(
        'my-products.accounts.form.friendlyName.placeholder',
      ),
    },
    type: {
      label: translate.instant('my-products.accounts.form.type.label'),
      placeholder: translate.instant(
        'my-products.accounts.form.type.placeholder',
      ),
      required: true,
    },
    currency: {
      label: translate.instant('my-products.accounts.form.currency.label'),
      placeholder: translate.instant(
        'my-products.accounts.form.currency.placeholder',
      ),
      required: true,
    },
  }) as const;

export const PERMISSION_ROUTE_MAP: { [key: number]: string } = {
  1: '/bank/transfers/internal',
  2: '/bank/transfers/external',
  4: '/bank/transfers/external',
  8: '/bank/paybill',
  16: '/bank/paybill',
  32: '/bank/loans',
} as const;
