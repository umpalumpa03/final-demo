import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './models/user-info.model';

export const selectUserInfoState =
  createFeatureSelector<IUserState>('user-info');

export const selectUserLoading = createSelector(
  selectUserInfoState,
  (state) => state.loading,
);

export const selectUserError = createSelector(
  selectUserInfoState,
  (state) => state.error,
);

export const selectUserInfo = createSelector(
  selectUserInfoState,
  (state) => state,
);

export const selectCurrentUserEmail = createSelector(
  selectUserInfoState,
  (state) => state.email,
);
