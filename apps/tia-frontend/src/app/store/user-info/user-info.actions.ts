import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  IUserInfo,
  UserRole,
} from '@tia/shared/models/user-info/user-info.models';
import { IWidgetItem } from '../../features/bank/dashboard/models/widgets.model';

export const UserInfoActions = createActionGroup({
  source: 'User Info',
  events: {
    'Load User': emptyProps(),
    'Load user success': props<{ user: IUserInfo }>(),
    'Load user error': props<{ error: string }>(),
    'Load user fullname': props<{ fullName: string | null }>(),
    'Load user email': props<{ email: string | null }>(),
    'Load user theme': props<{ theme: string | null }>(),
    'Load user language': props<{ language: string | null }>(),
    'Load user avatar': props<{ avatar: string | null }>(),
    'Load user role': props<{ role: UserRole | null }>(),
    'Load Widgets': emptyProps(),
    'Load Widgets Success': props<{ widgets: IWidgetItem[] }>(),
    'Load Widgets Error': props<{ error: string }>(),
    'Update Widget State': props<{ id: string; isSelected: boolean }>(),
    'Update Widget State Success': props<{ widget: IWidgetItem }>(),
  },
});
