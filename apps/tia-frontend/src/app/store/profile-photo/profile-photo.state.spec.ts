import { ProfilePhotoState } from './profile-photo.state';

describe('ProfilePhotoState', () => {
  it('should create a valid empty state object', () => {
    const state: ProfilePhotoState = {
      defaultAvatars: [],
      selectedAvatarId: null,
      uploadedFileName: null,
      currentAvatarUrl: null,
      avatarId: null,
      avatarType: null,
    };

    expect(state.defaultAvatars).toEqual([]);
    expect(state.selectedAvatarId).toBeNull();
  });
});
