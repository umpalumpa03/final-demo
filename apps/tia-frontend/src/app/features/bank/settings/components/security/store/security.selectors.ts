import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityState } from './security.state';

export const selectSecurityState =
  createFeatureSelector<SecurityState>('security');

export const selectSecurityLoading = createSelector(
  selectSecurityState,
  (s) => s.loading,
);

export const selectSecurityError = createSelector(
  selectSecurityState,
  (s) => s.error,
);

export const selectSecuritySuccess = createSelector(
  selectSecurityState,
  (s) => s.success,
);
