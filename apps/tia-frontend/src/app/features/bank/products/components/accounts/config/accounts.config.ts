import {
  AccountSection,
  CreateAccountConfig,
} from '../../../../../../shared/models/accounts/accounts.model';
import { AccountType } from '../../../../../../shared/models/accounts/accounts.model';
import { AccountUtils } from '../utils/account.utils';
import { TranslateService } from '@ngx-translate/core';

const accountUtils = new AccountUtils();

export const getAccountSections = (
  translate: TranslateService,
): AccountSection[] => [
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
];

export const getCreateAccountConfig = (
  translate: TranslateService,
): CreateAccountConfig => ({
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
  },
  currency: {
    label: translate.instant('my-products.accounts.form.currency.label'),
    placeholder: translate.instant(
      'my-products.accounts.form.currency.placeholder',
    ),
  },
});
