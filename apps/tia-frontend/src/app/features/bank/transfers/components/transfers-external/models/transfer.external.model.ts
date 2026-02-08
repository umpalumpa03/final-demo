export type DisabledReason = 'CURRENCY_MISMATCH' | 'PERMISSION_DENIED' | null;

export interface TransferMeta {
  recipientIban: string;
  senderAccountId: string;
  recipientName?: string;
  amount: number;
  description: string;
}
