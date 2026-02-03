export interface CardType {
  value: 'VISA' | 'MASTERCARD';
  displayName: string;
}

export type CardTypesResponse = CardType[];