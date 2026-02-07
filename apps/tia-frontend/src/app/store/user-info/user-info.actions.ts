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
    'Load Widgets': props<{ force?: boolean }>(),
    'Load Widgets Success': props<{ widgets: IWidgetItem[] }>(),
    'Load Widgets Error': props<{ error: string }>(),
    'Update Widget State': props<{
      id: string;
      updates: Partial<IWidgetItem>;
    }>(),
    'Update Widget State Success': props<{ widget: IWidgetItem }>(),
    'Create Widget': props<{ widget: IWidgetItem }>(),
    'Create Widget Success': props<{ widget: IWidgetItem }>(),
    'Create Widget Error': props<{ error: string }>(),
    'Update Widget State Error': props<{ error: string }>(),
    'Update Widgets Bulk': props<{
      updates: { id: string; updates: Partial<IWidgetItem> }[];
    }>(),
    'Update Widgets Bulk Success': props<{ widgets: IWidgetItem[] }>(),
    'Delete Widget': props<{ id: string }>(),
    'Delete Widget Success': props<{ id: string }>(),
    'Delete Widget Error': props<{ error: string }>(),
  },
});
