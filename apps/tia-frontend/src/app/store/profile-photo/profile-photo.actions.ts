import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DefaultAvatarResponse } from './profile-photo.state';

export const ProfilePhotoActions = createActionGroup({
  source: 'Profile Photo',
  events: {
    'Load Default Avatars': props<{ avatars: DefaultAvatarResponse[] }>(),
    'Load Default Avatars Failure': props<{ error: string }>(),
    'Select Default Avatar': props<{ avatarId: string; imageUrl: string }>(),
    'Upload File': props<{ fileName: string; objectUrl: string }>(),
    'Set Current Avatar': props<{ avatarId: string; avatarType: 'default' | 'custom'; avatarUrl: string }>(),
    'Remove Avatar': emptyProps(),
    'Clear Uploaded File': emptyProps(),
    'Upload Avatar Request': props<{ file: File }>(),
    'Upload Avatar Failure': props<{ error: string }>(),
    'Remove Avatar Request': emptyProps(),
    'Remove Avatar Failure': props<{ error: string }>(),
    'Select Default Avatar Request': props<{ avatarId: string }>(),
    'Select Default Avatar Failure': props<{ error: string }>(),
    'Load Stored Avatar': emptyProps(),
  },
});
