export interface CardDetail {
  id: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  network: 'VISA' | 'MASTERCARD';
  design: string;
  cardName: string;
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  allowOnlinePayments: boolean;
  allowInternational: boolean;
  creditLimit?: number; 
  allowAtm: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CardDetailsResponse = CardDetail;