import {
  selectProfilePhotoFeatureState,
  selectDefaultAvatars,
  selectSelectedAvatarId,
  selectUploadedFileName,
  selectCurrentAvatarUrl,
  selectAvatarId,
  selectAvatarType,
} from './profile-photo.selectors';
import { ProfilePhotoState } from './profile-photo.state';

describe('ProfilePhoto Selectors', () => {
  interface RootState {
    ProfilePhoto: ProfilePhotoState;
  }

  const getInitialState = (): ProfilePhotoState => ({
    defaultAvatars: [{ id: 'avatar-1', iconUri: '/avatars/1.png' }],
    defaultAvatarsLoading: false,
    defaultAvatarsError: null,
    selectedAvatarId: 'avatar-1',
    uploadedFileName: 'avatar.png',
    currentAvatarUrl: 'current-url',
    avatarId: 'avatar-1',
    avatarType: 'default',
  });

  it('should select feature state', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectProfilePhotoFeatureState(featureState);
    expect(result).toEqual(initialState);
  });

  it('should select default avatars', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectDefaultAvatars(featureState);
    expect(result).toEqual(initialState.defaultAvatars);
  });

  it('should select selected avatar id', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectSelectedAvatarId(featureState);
    expect(result).toBe(initialState.selectedAvatarId);
  });

  it('should select uploaded file name', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectUploadedFileName(featureState);
    expect(result).toBe(initialState.uploadedFileName);
  });

  it('should select current avatar url', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectCurrentAvatarUrl(featureState);
    expect(result).toBe(initialState.currentAvatarUrl);
  });

  it('should select avatar id', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectAvatarId(featureState);
    expect(result).toBe(initialState.avatarId);
  });

  it('should select avatar type', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const result = selectAvatarType(featureState);
    expect(result).toBe(initialState.avatarType);
  });
});
