import { createFeature, createReducer, on } from '@ngrx/store';
import { PersonalInfoActions } from './pesronal-info.actions';
import { personalInfoState } from './personal-info.state';


export const initialPersonalInfoState: personalInfoState = {
            pId: null,
            phoneNumber: '',
            loading: false,
            error: null,
            phoneUpdateChallengeId: null,
            phoneUpdateLoading: false,
            phoneUpdateError: null,
            phoneUpdatePendingPhone: null,
            phoneUpdateResendCount: 0,
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
            pId: personalInfo.pId,
            phoneNumber: personalInfo.phoneNumber,
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
        on(PersonalInfoActions.resetPersonalInfo, () => ({
            ...initialPersonalInfoState,
        })),
        on(PersonalInfoActions.initiatePhoneUpdate, (state, { phone }) => ({
            ...state,
            phoneUpdateLoading: true,
            phoneUpdateError: null,
            phoneUpdatePendingPhone: phone,
            phoneUpdateResendCount: 0,
        })),
        on(PersonalInfoActions.initiatePhoneUpdateSuccess, (state, { challengeId }) => ({
            ...state,
            phoneUpdateChallengeId: challengeId,
            phoneUpdateLoading: false,
            phoneUpdateError: null,
        })),
        on(PersonalInfoActions.initiatePhoneUpdateFailure, (state, { error }) => ({
            ...state,
            phoneUpdateLoading: false,
            phoneUpdateError: error,
            phoneUpdateChallengeId: null,
            phoneUpdatePendingPhone: null,
        })),
        on(PersonalInfoActions.verifyPhoneUpdate, (state) => ({
            ...state,
            phoneUpdateLoading: true,
            phoneUpdateError: null,
        })),
        on(PersonalInfoActions.verifyPhoneUpdateSuccess, (state, { message }) => ({
            ...state,
            phoneUpdateLoading: false,
            phoneUpdateError: null,
            phoneNumber: state.phoneUpdatePendingPhone,
            phoneUpdateChallengeId: null,
            phoneUpdatePendingPhone: null,
            phoneUpdateResendCount: 0,
        })),
        on(PersonalInfoActions.verifyPhoneUpdateFailure, (state, { error }) => ({
            ...state,
            phoneUpdateLoading: false,
            phoneUpdateError: error,
        })),
        on(PersonalInfoActions.resendPhoneOTP, (state) => ({
            ...state,
            phoneUpdateLoading: true,
            phoneUpdateError: null,
        })),
        on(PersonalInfoActions.resendPhoneOTPSuccess, (state) => ({
            ...state,
            phoneUpdateLoading: false,
            phoneUpdateError: null,
            phoneUpdateResendCount: state.phoneUpdateResendCount + 1,
        })),
        on(PersonalInfoActions.resendPhoneOTPFailure, (state, { error }) => ({
            ...state,
            phoneUpdateLoading: false,
            phoneUpdateError: error,
        })),
        on(PersonalInfoActions.resetPhoneUpdate, (state) => ({
            ...state,
            phoneUpdateChallengeId: null,
            phoneUpdateLoading: false,
            phoneUpdateError: null,
            phoneUpdatePendingPhone: null,
            phoneUpdateResendCount: 0,
        })),
    ),
});

export const personalInfoReducer = personalInfoFeature.reducer;