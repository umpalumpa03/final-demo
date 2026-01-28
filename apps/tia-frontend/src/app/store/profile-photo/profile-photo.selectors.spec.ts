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

  const initialState: ProfilePhotoState = {
    defaultAvatars: [{ id: '1', iconUri: '/avatar-1.svg' }],
    selectedAvatarId: '1',
    uploadedFileName: 'avatar.png',
    currentAvatarUrl: 'current-url',
    avatarId: 'avatar-1',
    avatarType: 'default',
  };

  const featureState: RootState = { ProfilePhoto: initialState };

  it('should select feature state', () => {
    const result = selectProfilePhotoFeatureState(featureState);
    expect(result).toEqual(initialState);
  });

  it('should select default avatars', () => {
    const result = selectDefaultAvatars(featureState);
    expect(result).toEqual(initialState.defaultAvatars);
  });

  it('should select selected avatar id', () => {
    const result = selectSelectedAvatarId(featureState);
    expect(result).toBe(initialState.selectedAvatarId);
  });

  it('should select uploaded file name', () => {
    const result = selectUploadedFileName(featureState);
    expect(result).toBe(initialState.uploadedFileName);
  });

  it('should select current avatar url', () => {
    const result = selectCurrentAvatarUrl(featureState);
    expect(result).toBe(initialState.currentAvatarUrl);
  });

  it('should select avatar id', () => {
    const result = selectAvatarId(featureState);
    expect(result).toBe(initialState.avatarId);
  });

  it('should select avatar type', () => {
    const result = selectAvatarType(featureState);
    expect(result).toBe(initialState.avatarType);
  });
});
