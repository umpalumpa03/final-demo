import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';
import { ThemeState } from './model/theme.reducer.models';
import { UserInfoActions } from '../user-info/user-info.actions';

const savedTheme = localStorage.getItem('theme');

const initialState: ThemeState = {
  activeTheme: savedTheme ? savedTheme : 'oceanBlue',
};

export const themeFeature = createFeature({
  name: 'ThemeSwitch',
  reducer: createReducer(
    initialState,
    on(ThemeActions.setTheme, (state, { theme }) => ({
      ...state,
      activeTheme: theme,
    })),
    on(UserInfoActions.loadUserSuccess, (state, { user }) => ({
      ...state,
      activeTheme: user.theme || state.activeTheme,
    })),
  ),
});
