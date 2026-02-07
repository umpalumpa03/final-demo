import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { personalInfoState } from './personal-info.state';

export const PersonalInfoActions = createActionGroup({
    source: 'Personal Info',
    events: {
        'Load Personal Info': props<{ forceRefresh?: boolean }>(),
        'Load Personal Info Success': props<{ personalInfo: personalInfoState }>(),
        'Load Personal Info Failure': props<{ error: string }>(),
        'Load Personal Info Phone Number': props<{ phoneNumber: string }>(),
        'Load Personal Info PId': props<{ pId: string }>(),
        'Update Personal Info': props<{ personalInfo: personalInfoState }>(),
        'Update Personal Info Success': props<{ personalInfo: personalInfoState }>(),
        'Update Personal Info Failure': props<{ error: string }>(),
        'Reset Personal Info': emptyProps(),
    },
});