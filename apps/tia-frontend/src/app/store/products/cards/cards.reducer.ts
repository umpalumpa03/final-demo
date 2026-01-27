import { createReducer } from '@ngrx/store';
import { CardsState } from './cards.state';

export const initialState: CardsState = {
  loading: false,
};

export const cardsReducer = createReducer(
  initialState
);