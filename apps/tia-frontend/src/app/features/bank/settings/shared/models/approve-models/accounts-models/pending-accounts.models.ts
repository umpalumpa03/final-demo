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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  balance: string;
  createdAt: string;
  user: IUser;
}

export interface IUpdateAccountStatus {
  accountId: string;
  updatedStatus:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'ACTIVE'
    | 'active'
    | 'closed';
}

export interface SuccessResponse {
  success: boolean;
}
