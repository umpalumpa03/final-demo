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
import { environment } from '../../../../../../../../environments/environment';

describe('ProfilePhoto Selectors', () => {
  interface RootState {
    ProfilePhoto: ProfilePhotoState;
  }

  const getInitialState = (): ProfilePhotoState => ({
    defaultAvatars: [{ id: 'avatar-1', imageUrl: `${environment.apiUrl}/avatars/1.png` }],
    defaultAvatarsLoading: false,
    defaultAvatarsError: null,
    selectedAvatarId: 'avatar-1',
    uploadedFileName: 'avatar.png',
    currentAvatarUrl: 'current-url',
    savedAvatarUrl: 'saved-url',
    avatarId: 'avatar-1',
    avatarType: 'default',
  });

  it('should select feature state', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: { ...initialState } };
    const result = selectProfilePhotoFeatureState(featureState);
    expect(result).toEqual(initialState);
  });

  it('should select default avatars', () => {
    const initialState = getInitialState();
    const featureState: RootState = { ProfilePhoto: initialState };
    const featureStateResult = selectProfilePhotoFeatureState(featureState);
    const result = selectDefaultAvatars.projector(featureStateResult);
    expect(result).toEqual(initialState.defaultAvatars);
  });

  it('should select selected avatar id', () => {
    const initialState = getInitialState();
    const result = selectSelectedAvatarId.projector(initialState);
    expect(result).toBe(initialState.selectedAvatarId);
  });

  it('should select uploaded file name', () => {
    const initialState = getInitialState();
    const result = selectUploadedFileName.projector(initialState);
    expect(result).toBe(initialState.uploadedFileName);
  });

  it('should select current avatar url', () => {
    const initialState = getInitialState();
    const result = selectCurrentAvatarUrl.projector(initialState);
    expect(result).toBe(initialState.currentAvatarUrl);
  });

  it('should select avatar id', () => {
    const initialState = getInitialState();
    const result = selectAvatarId.projector(initialState);
    expect(result).toBe(initialState.avatarId);
  });

  it('should select avatar type', () => {
    const initialState = getInitialState();
    const result = selectAvatarType.projector(initialState);
    expect(result).toBe(initialState.avatarType);
  });
});
