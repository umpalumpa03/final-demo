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
