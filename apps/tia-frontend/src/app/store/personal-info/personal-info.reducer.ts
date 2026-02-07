import { createFeature, createReducer, on } from '@ngrx/store';
import { PersonalInfoActions } from './pesronal-info.actions';
import { personalInfoState } from './personal-info.state';


export const initialPersonalInfoState: personalInfoState = {
            pId: null,
            phoneNumber: '',
            loading: false,
            error: null,
        };

export const personalInfoFeature = createFeature({
    name: 'personalInfo',
    reducer: createReducer(
        initialPersonalInfoState,
        on(PersonalInfoActions.loadPersonalInfo, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(PersonalInfoActions.loadPersonalInfoSuccess, (state, { personalInfo }) => ({
            ...state,
            ...personalInfo,
            loading: false,
            error: null,
        })),
        on(PersonalInfoActions.loadPersonalInfoFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error: error,
        })),
        on(PersonalInfoActions.loadPersonalInfoPhoneNumber, (state, { phoneNumber }) => ({
            ...state,
            phoneNumber: phoneNumber,
        })),
        on(PersonalInfoActions.loadPersonalInfoPId, (state, { pId }) => ({
            ...state,
            pId: pId,
        })),
        on(PersonalInfoActions.updatePersonalInfo, (state, { personalInfo }) => ({
            ...state,
            ...personalInfo,
            loading: true,
            error: null,
        })),
        on(PersonalInfoActions.updatePersonalInfoSuccess, (state, { personalInfo }) => ({
            ...state,
            ...personalInfo,
            loading: false,
            error: null,
        })),
        on(PersonalInfoActions.updatePersonalInfoFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error: error,
        })),
    ),
});

export const personalInfoReducer = personalInfoFeature.reducer;