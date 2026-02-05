export interface ProfilePhotoState {
  defaultAvatars: DefaultAvatarWithUrl[];
  defaultAvatarsLoading: boolean;
  defaultAvatarsError: string | null;
  selectedAvatarId: string | null;
  uploadedFileName: string | null;
  currentAvatarUrl: string | null;
  savedAvatarUrl: string | null;
  avatarId: string | null;
  avatarType: 'default' | 'custom' | null;
}


export interface DefaultAvatarResponse {
    id: string;
    iconUri: string;
  }

export interface DefaultAvatarWithUrl {
  id: string;
  imageUrl: string;
}
  
  export interface DefaultAvatar {
    id: string;
    imageUrl: string;
  }
  
  export interface CurrentUserAvatar {
    id: string;
    imageUrl: string | null;
    isDefault: boolean;
  }
  
  export interface UploadAvatarResponse {
    success: boolean;
    avatarId: string;
  }
