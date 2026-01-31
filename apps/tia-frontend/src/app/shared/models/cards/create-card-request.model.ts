export interface CreateCardRequest {
  accountId: string;
  design: string;
  cardName: string;
  cardCategory: 'DEBIT' | 'CREDIT';
  cardType: 'VISA' | 'MASTERCARD';
}

export interface CreateCardResponse {
  success: boolean;
}