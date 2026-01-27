import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsState } from './cards.state';

export const selectCardsState = createFeatureSelector<CardsState>('cards');

export const selectCardsLoading = createSelector(
  selectCardsState,
  (state) => state.loading
);