import { describe, it, expect } from 'vitest';
import { userInfoReducer, initialUserState } from './user-info.reducer';
import { UserInfoActions } from './user-info.actions';

describe('userInfoReducer', () => {
  it('sets loading on loadUser', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUser());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('merges user on loadUserSuccess', () => {
    const user = { fullName: 'A', theme: 't', language: 'l', avatar: 'a', role: 'r' } as any;
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserSuccess({ user }));
    expect(state.fullName).toBe('A');
    expect(state.theme).toBe('t');
    expect(state.language).toBe('l');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error on loadUserError', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserError({ error: 'err' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });
});
