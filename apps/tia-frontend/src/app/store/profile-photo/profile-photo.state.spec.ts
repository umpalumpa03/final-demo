import { ProfilePhotoState } from './profile-photo.state';

describe('ProfilePhotoState', () => {
  it('should create a valid empty state object', () => {
    const state: ProfilePhotoState = {
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

    expect(state.defaultAvatars).toEqual([]);
    expect(state.selectedAvatarId).toBeNull();
    expect(state.defaultAvatarsLoading).toBe(false);
    expect(state.defaultAvatarsError).toBeNull();
  });
});
