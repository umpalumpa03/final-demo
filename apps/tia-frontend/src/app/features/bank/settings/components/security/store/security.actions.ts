import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SecurityActions = createActionGroup({
  source: 'Security',
  events: {
    'Change Password': props<{ currentPassword: string; newPassword: string }>(),
    'Change Password Success': emptyProps(),
    'Change Password Failure': props<{ error: string }>(),
  },
});