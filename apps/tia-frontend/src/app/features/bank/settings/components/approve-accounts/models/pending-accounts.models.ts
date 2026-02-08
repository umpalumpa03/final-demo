export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface BankAccount {
  id: string;
  iban: string;
  type: 'card' | 'savings' | string;
  currency: 'USD' | 'GEL' | 'EUR' | string;
  name: string;
  status: 'pending' | 'active' | 'declined';
  balance: string;
  createdAt: string;
  user: IUser;
}
