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
        'Initiate Phone Update': props<{ phone: string }>(),
        'Initiate Phone Update Success': props<{ challengeId: string; method: string }>(),
        'Initiate Phone Update Failure': props<{ error: string }>(),
        'Verify Phone Update': props<{ challengeId: string; code: string }>(),
        'Verify Phone Update Success': props<{ message: string }>(),
        'Verify Phone Update Failure': props<{ error: string }>(),
        'Resend Phone OTP': props<{ challengeId: string }>(),
        'Resend Phone OTP Success': emptyProps(),
        'Resend Phone OTP Failure': props<{ error: string }>(),
        'Reset Phone Update': emptyProps(),
    },
});