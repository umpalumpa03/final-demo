import { VALID_PERMISSION_VALUES } from '../config/transfer-permissions.config';
import { TransferPermission } from '../model/transfer-permission.model';

export function filterPermissionsByCurrency(
  permissions: TransferPermission[],
  accountPermission: number,
  currency: string,
): TransferPermission[] {
  return permissions.filter((permission) => {
    const hasPermission =
      VALID_PERMISSION_VALUES.includes(
        permission.value as (typeof VALID_PERMISSION_VALUES)[number],
      ) && (accountPermission & permission.value) === permission.value;

    if (!hasPermission) {
      return false;
    }

    if (permission.value === 2 && currency !== 'GEL') {
      return false;
    }

    if (permission.value === 4 && currency === 'GEL') {
      return false;
    }

    return true;
  });
}
