import { TransferPermission } from '../components/account-card/components/transfer-permissions-modal/model/transfer-permission.model';

export const TRANSFER_PERMISSIONS: TransferPermission[] = [
  {
    label: 'my-products.accounts.transfer-modal.transfer-own-accounts',
    value: 1,
  },
  {
    label: 'my-products.accounts.transfer-modal.transfer-same-bank',
    value: 2,
  },
  {
    label: 'my-products.accounts.transfer-modal.transfer-foreign-currency',
    value: 4,
  },
  {
    label: 'my-products.accounts.transfer-modal.pay-bills',
    value: 8,
  },
  {
    label: 'my-products.accounts.transfer-modal.pay-fines',
    value: 16,
  },
  {
    label: 'my-products.accounts.transfer-modal.pay-loan',
    value: 32,
  },
];

export const VALID_PERMISSION_VALUES = [1, 2, 4, 8, 16, 32] as const;
