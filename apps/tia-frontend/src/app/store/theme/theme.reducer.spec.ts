import { themeFeature } from './theme.reducer';
import { ThemeActions } from './theme.actions';
import { UserInfoActions } from '../user-info/user-info.actions';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Theme Reducer', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return the default state for unknown actions', () => {
    const action = { type: 'Unknown Action' };
    const initialState = { activeTheme: 'oceanBlue' };

    const state = themeFeature.reducer(initialState, action as any);

    expect(state).toBe(initialState);
  });

  it('should change active theme to the selected one when setTheme is dispatched', () => {
    const initialState = { activeTheme: 'oceanBlue' };
    const newTheme = 'royalBlue';
    const action = ThemeActions.setTheme({ theme: newTheme });

    const state = themeFeature.reducer(initialState, action);
    expect(state.activeTheme).toBe(newTheme);
  });

  it('should update theme when loadUserSuccess is dispatched with theme', () => {
    const initialState = { activeTheme: 'oceanBlue' };
    const userTheme = 'royalBlue';
    const action = UserInfoActions.loadUserSuccess({
      user: {
        theme: userTheme,
        fullName: 'John Doe',
        role: 'CONSUMER',
        email: 'john@example.com',
        language: 'en',
        avatar: '',
      },
    });

    const state = themeFeature.reducer(initialState, action);
    expect(state.activeTheme).toBe(userTheme);
  });

  it('should keep current theme when loadUserSuccess is dispatched without theme', () => {
    const initialState = { activeTheme: 'oceanBlue' };
    const action = UserInfoActions.loadUserSuccess({
      user: {
        theme: null,
        fullName: 'John Doe',
        role: 'CONSUMER',
        email: 'john@example.com',
        language: 'en',
        avatar: '',
      },
    });

    const state = themeFeature.reducer(initialState, action);
    expect(state.activeTheme).toBe(initialState.activeTheme);
  });

  it('should update theme when loadUserSuccess is dispatched with user theme', () => {
    const initialState = { activeTheme: 'oceanBlue' };
    const action = UserInfoActions.loadUserSuccess({
      user: {
        theme: 'royalBlue',
        fullName: 'John Doe',
        role: 'CONSUMER',
        email: 'john@example.com',
        language: 'en',
        avatar: '',
      },
    });

    const state = themeFeature.reducer(initialState, action);
    expect(state.activeTheme).toBe('royalBlue');
  });
});
