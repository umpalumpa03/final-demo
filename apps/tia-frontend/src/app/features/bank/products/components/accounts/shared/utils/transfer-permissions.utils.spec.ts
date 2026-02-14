import { filterPermissionsByCurrency } from './transfer-permissions.utils';
import { TransferPermission } from '../model/transfer-permission.model';

describe('filterPermissionsByCurrency', () => {
  const mockPermissions: TransferPermission[] = [
    { label: 'Transfer Own Accounts', value: 1 },
    { label: 'Transfer Same Bank', value: 2 },
    { label: 'Transfer Foreign Currency', value: 4 },
    { label: 'Pay Bills', value: 8 },
    { label: 'Pay Fines', value: 16 },
    { label: 'Pay Loan', value: 32 },
  ];

  it('should return empty array when user has no permissions', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 0, 'GEL');
    expect(result).toEqual([]);
  });

  it('should filter by bitwise permission check', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 1 | 8, 'GEL');
    expect(result.length).toBe(2);
    expect(result[0].value).toBe(1);
    expect(result[1].value).toBe(8);
  });

  it('should exclude permission 2 (same bank) for non-GEL currency', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 2, 'USD');
    expect(result).toEqual([]);
  });

  it('should include permission 2 (same bank) for GEL currency', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 2, 'GEL');
    expect(result).toEqual([mockPermissions[1]]);
  });

  it('should exclude permission 4 (foreign currency) for GEL currency', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 4, 'GEL');
    expect(result).toEqual([]);
  });

  it('should include permission 4 (foreign currency) for non-GEL currency', () => {
    const result = filterPermissionsByCurrency(mockPermissions, 4, 'USD');
    expect(result).toEqual([mockPermissions[2]]);
  });

  it('should handle mixed permissions with currency rules', () => {
    const result = filterPermissionsByCurrency(
      mockPermissions,
      1 | 2 | 4,
      'GEL',
    );
    expect(result.length).toBe(2);
    expect(result.map((p) => p.value)).toEqual([1, 2]);
  });
});
