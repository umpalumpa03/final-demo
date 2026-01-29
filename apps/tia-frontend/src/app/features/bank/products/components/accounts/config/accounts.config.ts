import { AccountSection } from '../../../../../../shared/models/accounts/accounts.model';
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
