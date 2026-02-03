export interface CardCategory {
  value: 'DEBIT' | 'CREDIT';
  displayName: string;
}

export type CardCategoriesResponse = CardCategory[];