import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfilePhotoState } from './profile-photo.state';

export const selectProfilePhotoFeatureState =
  createFeatureSelector<ProfilePhotoState>('ProfilePhoto');

export const selectDefaultAvatars = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state ? state.defaultAvatars : [],
);

export const selectDefaultAvatarsLoading = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.defaultAvatarsLoading,
);

export const selectDefaultAvatarsError = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.defaultAvatarsError,
);

export const selectSelectedAvatarId = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.selectedAvatarId,
);

export const selectUploadedFileName = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.uploadedFileName,
);

export const selectCurrentAvatarUrl = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.currentAvatarUrl,
);

export const selectAvatarId = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.avatarId,
);

export const selectAvatarType = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.avatarType,
);

export const selectSavedAvatarUrl = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state.savedAvatarUrl,
);

export const selectUserInitials = createSelector(
  selectProfilePhotoFeatureState,
  (state) => state?.userInitials ?? null,
);