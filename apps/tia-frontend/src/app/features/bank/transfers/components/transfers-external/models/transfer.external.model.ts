export type DisabledReason = 'CURRENCY_MISMATCH' | 'PERMISSION_DENIED' | null;

export interface TransferMeta {
  recipientIban: string;
  senderAccountId: string;
  recipientName?: string;
  amount: number;
  description: string;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  amount: number; // changed from string to number
  transactionType: 'debit' | 'credit';
  transferType:
    | 'ToSomeoneSameBank'
    | 'ToSomeoneExternalBank'
    | 'ToOwnAccount'
    | 'BillPayment'
    | 'Loan'
    | string;
  currency: string;
  description: string;
  debitAccountNumber: string;
  creditAccountNumber: string | null; // can be null
  category: any; // different type
  meta?: Record<string, string> | null;
  convertionInfo?: any;
  createdAt: string;
  updatedAt: string;
}
