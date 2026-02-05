import { describe, it, expect } from 'vitest';
import {
  selectPersonalInfoState,
  selectPersonalInfo,
  selectPersonalInfoLoading,
  selectPersonalInfoError,
  selectPId,
  selectPhoneNumber,
} from './personal-info.selectors';
import type { personalInfoState } from './personal-info.state';

describe('personal-info selectors', () => {
  const state: { personalInfo: personalInfoState } = {
    personalInfo: {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: true,
      error: 'ERR',
    },
  };

  it('selectPersonalInfoState should return feature slice', () => {
    const result = selectPersonalInfoState(state);
    expect(result).toBe(state.personalInfo);
  });

  it('selectPersonalInfo should return full state', () => {
    const result = selectPersonalInfo(state);
    expect(result).toEqual(state.personalInfo);
  });

  it('selectPersonalInfoLoading should return loading', () => {
    const result = selectPersonalInfoLoading(state);
    expect(result).toBe(true);
  });

  it('selectPersonalInfoError should return error', () => {
    const result = selectPersonalInfoError(state);
    expect(result).toBe('ERR');
  });

  it('selectPId should return pId', () => {
    const result = selectPId(state);
    expect(result).toBe('12345678901');
  });

  it('selectPhoneNumber should return phoneNumber', () => {
    const result = selectPhoneNumber(state);
    expect(result).toBe('555999333');
  });
});

