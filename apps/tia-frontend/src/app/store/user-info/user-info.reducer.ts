import { createFeature, createReducer, on } from '@ngrx/store';
import { UserInfoActions } from './user-info.actions';
import { IUserState } from './models/user-info.model';

export const initialUserState: IUserState = {
  fullName: null,
  email: null,
  theme: localStorage.getItem('theme'),
  language: localStorage.getItem('language'),
  avatar: null,
  role: null,
  loaded: false,
  loading: false,
  error: null,
  widgets: [],
  widgetsLoading: false,
  widgetsLoaded: false,
};

export const userInfoFeature = createFeature({
  name: 'user-info',
  reducer: createReducer(
    initialUserState,

    on(UserInfoActions.loadUser, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(UserInfoActions.loadUserSuccess, (state, { user }) => {
      return {
        ...state,
        ...user,
        loaded: true,
        loading: false,
        error: null,
      };
    }),

    on(UserInfoActions.loadUserError, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(UserInfoActions.loadUserFullname, (state, { fullName }) => ({
      ...state,
      fullName: fullName,
      loading: false,
      error: null,
    })),

    on(UserInfoActions.loadUserEmail, (state, { email }) => ({
      ...state,
      email: email,
      loading: false,
      error: null,
    })),

    on(UserInfoActions.loadUserTheme, (state, { theme }) => ({
      ...state,
      theme: theme,
      loading: false,
      error: null,
    })),

    on(UserInfoActions.loadUserLanguage, (state, { language }) => ({
      ...state,
      language: language,
      loading: false,
      error: null,
    })),

    on(UserInfoActions.loadUserAvatar, (state, { avatar }) => ({
      ...state,
      avatar: avatar,
      loading: false,
      error: null,
    })),

    on(UserInfoActions.loadUserRole, (state, { role }) => ({
      ...state,
      role: role,
      loading: false,
      error: null,
    })),
    on(UserInfoActions.loadWidgets, (state) => ({
      ...state,
      widgetsLoading: true,
    })),

    on(UserInfoActions.loadWidgetsSuccess, (state, { widgets }) => ({
      ...state,
      widgets,
      widgetsLoading: false,
      widgetsLoaded: true,
    })),

    on(UserInfoActions.updateWidgetStateSuccess, (state, { widget }) => ({
      ...state,
      widgets: state.widgets.map((w) =>
        w.dbId === widget.dbId ? { ...w, isHidden: !widget.isActive } : w,
      ),
    })),
  ),
});

export const userInfoReducer = userInfoFeature.reducer;
