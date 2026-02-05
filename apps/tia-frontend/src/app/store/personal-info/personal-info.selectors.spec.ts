import { describe, it, expect } from 'vitest';
import {
  selectPersonalInfo,
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



  it('selectPersonalInfo should return full state', () => {
    const result = selectPersonalInfo(state);
    expect(result).toEqual(state.personalInfo);
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

