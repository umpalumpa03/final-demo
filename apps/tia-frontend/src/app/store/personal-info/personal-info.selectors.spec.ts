import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  selectPersonalInfo,
  selectPId,
  selectPhoneNumber,
} from './personal-info.selectors';
import type { personalInfoState } from './personal-info.state';

describe('personal-info selectors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const initialState: { personalInfo: personalInfoState } = {
    personalInfo: {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: true,
      error: 'ERR',
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    },
  };

  it('selectPersonalInfo should return full state', () => {
    const result = selectPersonalInfo.projector(initialState.personalInfo);
    expect(result).toEqual(initialState.personalInfo);
  });

  it('selectPId should return pId', () => {
    const result = selectPId.projector(initialState.personalInfo);
    expect(result).toBe('12345678901');
  });

  it('selectPhoneNumber should return phoneNumber', () => {
    const result = selectPhoneNumber.projector(initialState.personalInfo);
    expect(result).toBe('555999333');
  });

  it('should handle empty state for phone number', () => {
    const emptyState: personalInfoState = {
      pId: '',
      phoneNumber: '',
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    };
    const result = selectPhoneNumber.projector(emptyState);
    expect(result).toBe('');
  });
});
