import { createFeature, createReducer, on } from '@ngrx/store';
import { UserInfoActions } from './user-info.actions';
import { IUserState } from './models/user-info.model';
import { closeCardDetailsModal } from '../products/cards/cards.actions';

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
  hasCompletedOnboarding: false,
  birthday: null,
  birthdayModalClosedYear: null,
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
      widgets: [...widgets].sort((a, b) => (a.order || 99) - (b.order || 99)),
      widgetsLoading: false,
      widgetsLoaded: true,
    })),

    on(UserInfoActions.updateWidgetsBulkSuccess, (state, { widgets }) => ({
      ...state,
      widgets: state.widgets
        .map((w) => {
          const updated = widgets.find((u) => u.dbId === w.dbId);
          return updated
            ? { ...w, ...updated, isHidden: updated.isActive === false }
            : w;
        })
        .sort((a, b) => (a.order || 99) - (b.order || 99)),
      widgetsLoading: false,
    })),

    on(
      UserInfoActions.loadWidgets,
      UserInfoActions.createWidget,
      UserInfoActions.deleteWidget,
      (state) => ({
        ...state,
        widgetsLoading: true,
      }),
    ),

    on(UserInfoActions.deleteWidgetSuccess, (state, { id }) => ({
      ...state,
      widgets: state.widgets.filter((w) => w.dbId !== id),
      widgetsLoading: false,
    })),

    on(
      UserInfoActions.loadUserError,
      UserInfoActions.loadWidgetsError,
      UserInfoActions.createWidgetError,
      UserInfoActions.updateWidgetsBulkError,
      UserInfoActions.deleteWidgetError,
      (state, { error }) => ({
        ...state,
        loading: false,
        widgetsLoading: false,
        error,
      }),
    ),

    on(
      UserInfoActions.loadHasCompletedOnboarding,
      (state, { onboCompleted }) => ({
        ...state,
        hasCompletedOnboarding: onboCompleted,
        loading: false,
        error: null,
      }),
    ),

    on(UserInfoActions.loadBirthday, (state, { birthDay }) => ({
      ...state,
      birthday: birthDay,
      loading: false,
      error: null,
    })),

    on(
      UserInfoActions.loadBirthdayModalClosed,
      (state, { colsedBirthdayModal }) => ({
        ...state,
        birthdayModalClosedYear: colsedBirthdayModal,
        loading: false,
        error: null,
      }),
    ),

    on(UserInfoActions.logout, () => ({
      ...initialUserState,
    })),
  ),
});

export const userInfoReducer = userInfoFeature.reducer;
