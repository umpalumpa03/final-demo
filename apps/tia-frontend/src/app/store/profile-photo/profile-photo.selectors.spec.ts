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
  const initialState: ProfilePhotoState = {
    defaultAvatars: [{ id: '1', iconUri: 'icon-url' }],
    selectedAvatarId: '1',
    uploadedFileName: 'avatar.png',
    currentAvatarUrl: 'current-url',
    avatarId: 'avatar-1',
    avatarType: 'default',
  };

  const featureState = { ProfilePhoto: initialState };

  it('should select feature state', () => {
    const result = selectProfilePhotoFeatureState(featureState as any);
    expect(result).toEqual(initialState);
  });

  it('should select default avatars', () => {
    const result = selectDefaultAvatars(featureState as any);
    expect(result).toEqual(initialState.defaultAvatars);
  });

  it('should select selected avatar id', () => {
    const result = selectSelectedAvatarId(featureState as any);
    expect(result).toBe(initialState.selectedAvatarId);
  });

  it('should select uploaded file name', () => {
    const result = selectUploadedFileName(featureState as any);
    expect(result).toBe(initialState.uploadedFileName);
  });

  it('should select current avatar url', () => {
    const result = selectCurrentAvatarUrl(featureState as any);
    expect(result).toBe(initialState.currentAvatarUrl);
  });

  it('should select avatar id', () => {
    const result = selectAvatarId(featureState as any);
    expect(result).toBe(initialState.avatarId);
  });

  it('should select avatar type', () => {
    const result = selectAvatarType(featureState as any);
    expect(result).toBe(initialState.avatarType);
  });
});
