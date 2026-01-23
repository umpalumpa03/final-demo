import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';

export interface ThemeState {
  activeTheme: string;
}

const savedTheme = localStorage.getItem('theme');

const initialState: ThemeState = {
  activeTheme: savedTheme ? savedTheme : 'ocean-blue',
};

export const themeFeature = createFeature({
  name: 'ThemeSwitch',
  reducer: createReducer(
    initialState,
    on(ThemeActions.setTheme, (state, { theme }) => ({
      ...state,
      activeTheme: theme,
    })),
  ),
});
