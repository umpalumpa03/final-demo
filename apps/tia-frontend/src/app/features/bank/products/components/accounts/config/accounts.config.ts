import {
  AccountSection,
  CreateAccountConfig,
} from '../../../../../../shared/models/accounts/accounts.model';
import { AccountType } from '../../../../../../shared/models/accounts/accounts.model';
import { AccountUtils } from '../utils/account.utils';

const accountUtils = new AccountUtils();

export const accountSections: AccountSection[] = [
  {
    key: AccountType.current,
    title: 'Current Accounts',
    icon: accountUtils.getAccountIcon(AccountType.current),
  },
  {
    key: AccountType.saving,
    title: 'Savings Accounts',
    icon: accountUtils.getAccountIcon(AccountType.saving),
  },
  {
    key: AccountType.card,
    title: 'Cards',
    icon: accountUtils.getAccountIcon(AccountType.card),
  },
] as const;

export const CREATE_ACCOUNT_CONFIG: CreateAccountConfig = {
  friendlyName: {
    label: 'Account Name',
    placeholder: 'e.g., Emergency Fund',
  },
  type: {
    label: 'Account Type',
    placeholder: 'Select account type',
  },
  currency: {
    label: 'Currency',
    placeholder: 'Select currency',
  },
} as const;
