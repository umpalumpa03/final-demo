import { themeFeature } from './theme.reducer';
import { ThemeActions } from './theme.actions';
import { describe, it, expect } from 'vitest';

describe('Theme Reducer', () => {
  it('should return the default state for unknown actions', () => {
    const action = { type: 'Unknown Action' };
    const initialState = { activeTheme: 'ocean-blue' };

    const state = themeFeature.reducer(initialState, action as any);

    expect(state).toBe(initialState);
  });

  it('should change active theme to the selected one when setTheme is dispatched', () => {
    const initialState = { activeTheme: 'ocean-blue' };
    const newTheme = 'dark-mode';
    const action = ThemeActions.setTheme({ theme: newTheme });

    const state = themeFeature.reducer(initialState, action);
    expect(state.activeTheme).toBe(newTheme);
  });
});
