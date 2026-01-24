import { createActionGroup, props } from '@ngrx/store';

export const ThemeActions = createActionGroup({
  source: 'Theme Switch',
  events: {
    'Set Theme': props<{ theme: string }>(),
  },
});
