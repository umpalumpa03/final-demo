export interface ProfilePhotoState {
  defaultAvatars: DefaultAvatarResponse[];
  selectedAvatarId: string | null;
  uploadedFileName: string | null;
  currentAvatarUrl: string | null;
  avatarId: string | null;
  avatarType: 'default' | 'custom' | null;
}


export interface DefaultAvatarResponse {
    id: string;
    iconUri: string;
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
