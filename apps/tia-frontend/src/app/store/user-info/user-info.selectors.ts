import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './models/user-info.model';

export const selectUserInfoState =
  createFeatureSelector<IUserState>('user-info');

export const selectUserLoading = createSelector(
  selectUserInfoState,
  (state) => state.loading,
);

export const selectUserLoaded = createSelector(
  selectUserInfoState,
  (state) => state.loaded,
);

export const selectUserError = createSelector(
  selectUserInfoState,
  (state) => state.error,
);

export const selectUserInfo = createSelector(
  selectUserInfoState,
  (state) => state,
);

export const selectUserFullName = createSelector(
  selectUserInfoState,
  (state) => state.fullName,
);

export const selectUserTheme = createSelector(
  selectUserInfoState,
  (state) => state.theme,
);

export const selectUserLanguage = createSelector(
  selectUserInfoState,
  (state) => state.language,
);

export const selectUserAvatar = createSelector(
  selectUserInfoState,
  (state) => state.avatar,
);

export const selectUserRole = createSelector(
  selectUserInfoState,
  (state) => state.role,
);

export const selectCurrentUserEmail = createSelector(
  selectUserInfoState,
  (state) => state.email,
);

export const selectUserWidgets = createSelector(
  selectUserInfoState,
  (state) => state.widgets,
);

export const selectWidgetsLoading = createSelector(
  selectUserInfoState,
  (state) => state.widgetsLoading,
);

export const selectWidgetsLoaded = createSelector(
  selectUserInfoState,
  (state) => state.widgetsLoaded,
);

export const selectOnboardingStatus = createSelector(
  selectUserInfoState,
  (state) => state.hasCompletedOnboarding,
);
