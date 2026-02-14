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
  selectOnboardingStatus,
  selectIsTodayBirthday,
  selectUserWidgets
} from './user-info.selectors';

describe('user-info selectors', () => {
  const slice = { 
    fullName: 'John Doe', 
    loading: false, 
    error: null, 
    theme: 'dark', 
    language: 'ka',
    email: 'test@test.com',
    loaded: true,
    avatar: 'url',
    role: 'ADMIN',
    hasCompletedOnboarding: true,
    widgets: [{ id: '1' }],
    birthday: '14-2'
  } as any;

  it('selectUserLoading returns loading', () => {
    expect(selectUserLoading.projector(slice)).toBe(false);
  });

  it('selectUserError returns error', () => {
    expect(selectUserError.projector(slice)).toBe(null);
  });

  it('selectCurrentUserEmail returns email', () => {
    expect(selectCurrentUserEmail.projector(slice)).toBe('test@test.com');
  });

  it('selectOnboardingStatus returns onboarding status', () => {
    expect(selectOnboardingStatus.projector(slice)).toBe(true);
  });

  it('selectUserWidgets returns widgets', () => {
    expect(selectUserWidgets.projector(slice)).toEqual([{ id: '1' }]);
  });

  describe('selectIsTodayBirthday', () => {
    it('should return true if today is birthday', () => {
      const today = new Date();
      const bDay = `${today.getDate()}-${today.getMonth() + 1}`;
      const userWithBday = { birthday: bDay } as any;
      expect(selectIsTodayBirthday.projector(userWithBday)).toBe(true);
    });

    it('should return false if today is not birthday', () => {
      const userWithBday = { birthday: '31-12' } as any;
      const today = new Date();
      if (today.getDate() === 31 && today.getMonth() === 11) {
        userWithBday.birthday = '01-01';
      }
      expect(selectIsTodayBirthday.projector(userWithBday)).toBe(false);
    });

    it('should return false if birthday is not provided', () => {
      expect(selectIsTodayBirthday.projector({})).toBe(false);
    });
  });

  it('selectUserFullName returns name', () => {
    expect(selectUserFullName.projector(slice)).toBe('John Doe');
  });

  it('selectUserRole returns role', () => {
    expect(selectUserRole.projector(slice)).toBe('ADMIN');
  });
});