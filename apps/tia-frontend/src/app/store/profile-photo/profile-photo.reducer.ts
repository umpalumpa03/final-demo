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
    })),
    on(ProfilePhotoActions.removeAvatar, (state) => ({
      ...state,
      uploadedFileName: null,
      selectedAvatarId: null,
      currentAvatarUrl: null,
      savedAvatarUrl: null,
      avatarId: null,
      avatarType: null,
    })),
    on(ProfilePhotoActions.clearUploadedFile, (state) => ({
      ...state,
      uploadedFileName: null,
    })),
    on(ProfilePhotoActions.selectDefaultAvatarRequest, (state, { avatarId }) => ({
      ...state,
      selectedAvatarId: avatarId,
      uploadedFileName: null,
    })),
  ),
});
