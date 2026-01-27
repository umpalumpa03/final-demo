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