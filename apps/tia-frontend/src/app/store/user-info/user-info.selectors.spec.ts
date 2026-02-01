import { describe, it, expect } from 'vitest';
import { selectUserInfo, selectUserLoading, selectUserError, selectUserInfoState } from './user-info.selectors';

describe('user-info selectors', () => {
  const slice = { fullName: 'X', loading: true, error: 'e', theme: 't', language: 'l' } as any;
  const state: any = { 'user-info': slice };

  it('selectUserLoading returns loading', () => {
    expect(selectUserLoading(state)).toBe(true);
  });

  it('selectUserError returns error', () => {
    expect(selectUserError(state)).toBe('e');
  });

  it('selectUserInfoState returns feature state', () => {
    expect(selectUserInfoState(state)).toEqual(slice);
  });

  it('selectUserInfo returns full slice', () => {
    expect(selectUserInfo(state)).toEqual(slice);
  });
});
