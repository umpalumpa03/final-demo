import { describe, it, expect } from 'vitest';
import {
  selectUserLoading,
  selectUserError,
  selectCurrentUserEmail,
  selectUserLoaded,
  selectUserInfo,
  selectUserFullName,
  selectUserTheme,
  selectUserLanguage,
  selectUserAvatar,
  selectUserRole,
} from './user-info.selectors';

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

  it('selectUserLoaded returns loaded', () => {
    slice.loaded = true;
    expect(selectUserLoaded(state)).toBe(true);
  });

  it('selectUserInfo returns the state', () => {
    expect(selectUserInfo(state)).toBe(slice);
  });

  it('selectUserFullName returns fullName', () => {
    expect(selectUserFullName(state)).toBe('X');
  });

  it('selectUserTheme returns theme', () => {
    expect(selectUserTheme(state)).toBe('t');
  });

  it('selectUserLanguage returns language', () => {
    expect(selectUserLanguage(state)).toBe('l');
  });

  it('selectUserAvatar returns avatar', () => {
    slice.avatar = 'url';
    expect(selectUserAvatar(state)).toBe('url');
  });

  it('selectUserRole returns role', () => {
    slice.role = 'SUPPORT';
    expect(selectUserRole(state)).toBe('SUPPORT');
  });
});