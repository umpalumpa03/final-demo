import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';
import { ThemeState } from './model/theme.reducer.models';

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
