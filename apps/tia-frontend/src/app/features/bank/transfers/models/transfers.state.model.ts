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
  recipientInput: string; 
  amount: number;
  description: string;
  manualRecipientName: string; 
  senderAccount: Account | null; 
  receiverOwnAccount: Account | null; 
  selectedRecipientAccount: RecipientAccount | null;
  recipientInfo: RecipientResponse | null; 
  challengeId: string | null; 
  fee: number;
  totalWithFee: number;
  hasInsufficientBalance: boolean;
  isFeeLoading: boolean;
  hasShownAmountToast: boolean;
  recipientType: RecipientType | null;
  requiresOtp: boolean; 
  pendingTransferId: string | null;
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
export interface TransferVerifyResponse {
  success: boolean;
  transferId: string;
  message?: string;
}
