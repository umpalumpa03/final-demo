import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfilePhotoActions } from './profile-photo.actions';
import { ProfilePhotoState } from './profile-photo.state';


const initialState: ProfilePhotoState = {
  defaultAvatars: [],
  defaultAvatarsLoading: false,
  defaultAvatarsError: null,
  selectedAvatarId: null,
  uploadedFileName: null,
  currentAvatarUrl: null,
  savedAvatarUrl: null,
  avatarId: null,
  avatarType: null,
  userInitials: null,
  savingChanges: false,
};

export const profilePhotoFeature = createFeature({
  name: 'ProfilePhoto',
  reducer: createReducer(
    initialState,
    on(ProfilePhotoActions.loadDefaultAvatarsRequest, (state) => ({
      ...state,
      defaultAvatarsLoading: true,
      defaultAvatarsError: null,
    })),
    on(ProfilePhotoActions.loadDefaultAvatars, (state, { avatars }) => ({
      ...state,
      defaultAvatars: avatars,
      defaultAvatarsLoading: false,
      defaultAvatarsError: null,
    })),
    on(ProfilePhotoActions.loadDefaultAvatarsFailure, (state, { error }) => ({
      ...state,
      defaultAvatarsLoading: false,
      defaultAvatarsError: error,
    })),
    on(ProfilePhotoActions.selectDefaultAvatar, (state, { avatarId, imageUrl }) => ({
      ...state,
      selectedAvatarId: avatarId,
      uploadedFileName: null,
      currentAvatarUrl: imageUrl,

    })),
    on(ProfilePhotoActions.uploadFile, (state, { fileName, objectUrl }) => ({
      ...state,
      uploadedFileName: fileName,
      selectedAvatarId: null,
      currentAvatarUrl: objectUrl,

    })),
    on(ProfilePhotoActions.setCurrentAvatar, (state, { avatarId, avatarType, avatarUrl }) => ({
      ...state,
      avatarId,
      avatarType,
      currentAvatarUrl: avatarUrl,
      savedAvatarUrl: avatarUrl,
      uploadedFileName: null,
      selectedAvatarId: avatarType === 'default' ? avatarId : null,
      savingChanges: false,
    })),
    on(ProfilePhotoActions.removeAvatar, (state) => ({
      ...state,
      uploadedFileName: null,
      selectedAvatarId: null,
      currentAvatarUrl: null,
      savedAvatarUrl: null,
      avatarId: null,
      avatarType: null,
      savingChanges: false,
    })),
    on(ProfilePhotoActions.clearUploadedFile, (state) => ({
      ...state,
      uploadedFileName: null,
      ...(state.savingChanges && { savingChanges: false }),
    })),
    on(ProfilePhotoActions.clearCurrentAvatar, (state) => ({
      ...state,
      currentAvatarUrl: null,
      selectedAvatarId: null,
      uploadedFileName: null,
    })),
    on(ProfilePhotoActions.selectDefaultAvatarRequest, (state, { avatarId }) => ({
      ...state,
      selectedAvatarId: avatarId,
      uploadedFileName: null,
      savingChanges: true,
    })),
    on(ProfilePhotoActions.uploadAvatarRequest, (state) => ({
      ...state,
      savingChanges: true,
    })),
    on(ProfilePhotoActions.removeAvatarRequest, (state) => ({
      ...state,
      savingChanges: true,
    })),
    on(
      ProfilePhotoActions.uploadAvatarFailure,
      ProfilePhotoActions.selectDefaultAvatarFailure,
      ProfilePhotoActions.removeAvatarFailure,
      (state) => ({
        ...state,
        savingChanges: false,
      }),
    ),
    on(ProfilePhotoActions.setUserInitials, (state, { initials }) => ({
      ...state,
      userInitials: initials,
    })),
    on(ProfilePhotoActions.resetProfilePhoto, (state) => ({
      ...initialState,
      defaultAvatars: state.defaultAvatars,
      defaultAvatarsLoading: state.defaultAvatarsLoading,
      defaultAvatarsError: state.defaultAvatarsError,
     
      savedAvatarUrl: state.savedAvatarUrl,
      avatarId: state.avatarId,
      avatarType: state.avatarType,
    })),
  ),
});
