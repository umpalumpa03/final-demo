import { createFeatureSelector, createSelector } from '@ngrx/store';
import { personalInfoState } from './personal-info.state';

export const selectPersonalInfoState =
  createFeatureSelector<personalInfoState>('personalInfo');

export const selectPersonalInfo = createSelector(
  selectPersonalInfoState,
  (state) => state,
);

export const selectPersonalInfoLoading = createSelector(
  selectPersonalInfoState,
  (state) => state.loading,
);

export const selectPersonalInfoError = createSelector(
  selectPersonalInfoState,
  (state) => state.error,
);

export const selectPId = createSelector(
  selectPersonalInfoState,
  (state) => state.pId,
);

export const selectPhoneNumber = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneNumber,
);

export const selectPhoneUpdateChallengeId = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneUpdateChallengeId,
);

export const selectPhoneUpdateLoading = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneUpdateLoading,
);

export const selectPhoneUpdateError = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneUpdateError,
);

export const selectPhoneUpdatePendingPhone = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneUpdatePendingPhone,
);

export const selectPhoneUpdateResendCount = createSelector(
  selectPersonalInfoState,
  (state) => state.phoneUpdateResendCount,
);