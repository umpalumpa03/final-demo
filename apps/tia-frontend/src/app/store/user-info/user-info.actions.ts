import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IUserInfo } from '@tia/shared/models/user-info/user-info.models';

export const UserInfoActions = createActionGroup({
  source: 'User Info',
  events: {
    'Load User': emptyProps(),
    'Load user success': props<{ user: IUserInfo }>(),
    'Load user error': props<{ error: string }>(),
  },
});

