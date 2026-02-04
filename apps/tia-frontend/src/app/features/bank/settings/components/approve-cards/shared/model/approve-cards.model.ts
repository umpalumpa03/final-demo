export interface CardUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface CardAccount {
  id: string;
  iban: string;
  type: string;
}

export interface PendingCard {
  id: string;
  cardNumber: string;
  cardholderName: string;
  design: string;
  type: 'DEBIT' | 'CREDIT'; 
  network: 'VISA' | 'MASTERCARD';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  nickname: string;
  createdAt: string;
  user: CardUser;
  account: CardAccount;
}
