import { describe, it, expect } from 'vitest';
import { selectUserLoading, selectUserError, selectCurrentUserEmail, } from './user-info.selectors';

describe('user-info selectors', () => {
  const slice = { fullName: 'X', loading: true, error: 'e', theme: 't', language: 'l' } as any;
  const state: any = { 'user-info': slice };

  it('selectUserLoading returns loading', () => {
    expect(selectUserLoading(state)).toBe(true);
  });

  it('selectUserError returns error', () => {
    expect(selectUserError(state)).toBe('e');
  });

  it('shoul d select current user email', () => {
    slice.email = 'test@example.com';
    expect(selectCurrentUserEmail(state)).toBe('test@example.com');
  });
});