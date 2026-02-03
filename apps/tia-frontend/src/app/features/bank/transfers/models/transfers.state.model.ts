import { Account } from '@tia/shared/models/accounts/accounts.model';
export type RecipientType = 'phone' | 'iban-same-bank' | 'iban-different-bank';
export type Currency = 'GEL' | 'USD' | 'EUR';

export interface RecipientAccount {
  id: string;
  iban: string;
  currency: Currency;
  name?: string;
  balance?: number;
}

export interface RecipientResponse {
  fullName: string;
  accounts: RecipientAccount[];
  currency?: Currency;
  userId?: string;
}

export interface TransferState {
  //form this
  recipientInput: string; //iban or number
  amount: number; //transfer amount
  description: string; //optional transfer description
  manualRecipientName: string; //for transfer in other bank

  //selection state
  senderAccount: Account | null; //selected sender account, used by both flow(g)
  receiverOwnAccount: Account | null; //used by transfer internal(g)
  selectedRecipientAccount: RecipientAccount | null; //for other account same bank flow
  ///response
  recipientInfo: RecipientResponse | null; //response after view account
  challengeId: string | null; //needed for otp, this and transferid are unclear
  fee: number; //repsponse from /get-fee
  totalWithFee: number;
  hasInsufficientBalance: boolean;

  //derived state
  recipientType: RecipientType | null; // from validation, values: 'phone','iban-same-bank' , 'iban-different-bank'
  requiresOtp: boolean; //if amount to be transfered is above 50GEL
  pendingTransferId: string | null;

  //uistate
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  isVerified: boolean;
  transferSuccess: boolean;
}
export type AccountData = Account | RecipientAccount;
export interface FeeResponse {
  fee: number;
}
export interface TransferResponse {
  verify: {
    challengeId: string;
    method: string | null;
  };
  transferType: string;
}
