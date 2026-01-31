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
  manualRecipientCurrency: Currency | null; //for other account transfer other bank

  ///response
  recipientInfo: RecipientResponse | null; //response after view account
  transferId: string | null; //transferid from response
  challengeId: string | null; //needed for otp, this and transferid are unclear
  fee: number; //repsponse from /get-fee

  //derived state
  recipientType: RecipientType | null; // from validation, values: 'phone','iban-same-bank' , 'iban-different-bank'
  requiresOTP: boolean; //if amount to be transfered is above 50GEL

  //uistate
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}
export type AccountData = Account | RecipientAccount;
