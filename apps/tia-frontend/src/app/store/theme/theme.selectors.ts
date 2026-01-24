import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from './model/theme.reducer.models';

export const selectThemeFeatureState =
  createFeatureSelector<ThemeState>('ThemeSwitch');

export const selectActiveTheme = createSelector(
  selectThemeFeatureState,
  (state) => state.activeTheme,
);
    