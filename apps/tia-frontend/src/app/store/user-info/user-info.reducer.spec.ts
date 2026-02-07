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
    const user = { fullName: 'A', email: 'a@example.com', theme: 't', language: 'l', avatar: 'a', role: 'r' } as any;
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserSuccess({ user }));
    expect(state.fullName).toBe('A');
    expect(state.email).toBe('a@example.com');
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

  it('sets fullName on loadUserFullname', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserFullname({ fullName: 'John' }));
    expect(state.fullName).toBe('John');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets email on loadUserEmail', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserEmail({ email: 'john@example.com' }));
    expect(state.email).toBe('john@example.com');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets theme on loadUserTheme', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserTheme({ theme: 'dark' }));
    expect(state.theme).toBe('dark');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets language on loadUserLanguage', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserLanguage({ language: 'en' }));
    expect(state.language).toBe('en');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets avatar on loadUserAvatar', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserAvatar({ avatar: 'url' }));
    expect(state.avatar).toBe('url');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets role on loadUserRole', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserRole({ role: 'SUPPORT' }));
    expect(state.role).toBe('SUPPORT');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
