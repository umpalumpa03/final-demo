import { describe, it, expect } from 'vitest';
import {
  selectPersonalInfo,
  selectPId,
  selectPhoneNumber,
} from './personal-info.selectors';
import type { personalInfoState } from './personal-info.state';

describe('personal-info selectors', () => {
  const initialState: { personalInfo: personalInfoState } = {
    personalInfo: {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: true,
      error: 'ERR',
    },
  };

  it('selectPersonalInfo should return full state', () => {
    const result = selectPersonalInfo(initialState);
    expect(result).toEqual(initialState.personalInfo);
  });

  it('selectPId should return pId', () => {
    const result = selectPId(initialState);
    expect(result).toBe('12345678901');
  });

  it('selectPhoneNumber should return phoneNumber', () => {
    const result = selectPhoneNumber(initialState);
    expect(result).toBe('555999333');
  });

  it('should handle empty state for phone number', () => {
    const emptyState = {
      personalInfo: {
        pId: '',
        phoneNumber: '',
        loading: false,
        error: null,
      },
    };
    const result = selectPhoneNumber(emptyState);
    expect(result).toBe('');
  });
});
