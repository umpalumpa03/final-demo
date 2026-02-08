import { describe, it, expect } from 'vitest';
import { formatUserFullName } from './user-formatter.utils';
import { IUser } from '../models/pending-accounts.models';

describe('formatUserFullName', () => {
  it('should return formatted full name when user exists', () => {
    const mockUser = {
      firstName: 'Giorgi',
      lastName: 'Zviadauri',
    } as IUser;

    const result = formatUserFullName(mockUser);

    expect(result).toBe('Giorgi Zviadauri');
  });

  it('should return "Unknown User" when user is undefined', () => {
    const result = formatUserFullName(undefined);

    expect(result).toBe('Unknown User');
  });

  it('should return "Unknown User" when user is null', () => {
    const result = formatUserFullName(null as any);

    expect(result).toBe('Unknown User');
  });
});
