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
    expect((selectUserLoading as any).projector(slice)).toBe(true);
  });

  it('selectUserError returns error', () => {
    expect((selectUserError as any).projector(slice)).toBe('e');
  });

  it('shoul d select current user email', () => {
    slice.email = 'test@example.com';
    expect((selectCurrentUserEmail as any).projector(slice)).toBe('test@example.com');
  });

  it('selectUserLoaded returns loaded', () => {
    slice.loaded = true;
    expect((selectUserLoaded as any).projector(slice)).toBe(true);
  });

  it('selectUserInfo returns the state', () => {
    expect((selectUserInfo as any).projector(slice)).toBe(slice);
  });

  it('selectUserFullName returns fullName', () => {
    expect((selectUserFullName as any).projector(slice)).toBe('X');
  });

  it('selectUserTheme returns theme', () => {
    expect((selectUserTheme as any).projector(slice)).toBe('t');
  });

  it('selectUserLanguage returns language', () => {
    expect((selectUserLanguage as any).projector(slice)).toBe('l');
  });

  it('selectUserAvatar returns avatar', () => {
    slice.avatar = 'url';
    expect((selectUserAvatar as any).projector(slice)).toBe('url');
  });

  it('selectUserRole returns role', () => {
    slice.role = 'SUPPORT';
    expect((selectUserRole as any).projector(slice)).toBe('SUPPORT');
  });
});